import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { getZone } from "@/lib/ai-closing-data";
import {
  normalizeVisionEvaluation,
  visionEvaluationJsonSchema,
} from "@/lib/ai-closing/evaluation";
import { buildAiClosingEvaluationPrompt } from "@/lib/ai-closing/evaluation-prompt";

export const runtime = "nodejs";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_VISION_MODEL = "gpt-5.5";
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const SUPPORTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

type OpenAiResponsesRequest = {
  model: string;
  input: Array<{
    role: "user";
    content: Array<
      | {
          type: "input_text";
          text: string;
        }
      | {
          type: "input_image";
          image_url: string;
          detail: "high";
        }
    >;
  }>;
  text: {
    format: {
      type: "json_schema";
      name: string;
      schema: typeof visionEvaluationJsonSchema;
      strict: true;
    };
  };
};

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function extractOutputText(responseBody: unknown): string | undefined {
  if (!responseBody || typeof responseBody !== "object") {
    return undefined;
  }

  const candidate = responseBody as {
    output_text?: unknown;
    output?: Array<{
      content?: Array<{
        type?: string;
        text?: unknown;
      }>;
    }>;
  };

  if (typeof candidate.output_text === "string") {
    return candidate.output_text;
  }

  for (const outputItem of candidate.output ?? []) {
    for (const contentItem of outputItem.content ?? []) {
      if (
        (contentItem.type === "output_text" || contentItem.type === "text") &&
        typeof contentItem.text === "string"
      ) {
        return contentItem.text;
      }
    }
  }

  return undefined;
}

function safeParseJson(text: string) {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return undefined;
  }
}

function auditVisionEvaluation(payload: {
  request: OpenAiResponsesRequest;
  response: unknown;
  status: "success" | "error";
  image: {
    sha256: string;
    size: number;
    type: string;
    name: string;
  };
}) {
  const redactedRequest = {
    ...payload.request,
    input: payload.request.input.map((inputItem) => ({
      ...inputItem,
      content: inputItem.content.map((contentItem) =>
        contentItem.type === "input_image"
          ? {
              ...contentItem,
              image_url: `[redacted:data-url:sha256:${payload.image.sha256}]`,
            }
          : contentItem,
      ),
    })),
  };

  console.info(
    JSON.stringify({
      event: "ai_closing_vision_evaluation",
      status: payload.status,
      image: payload.image,
      request: redactedRequest,
      response: payload.response,
    }),
  );
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return jsonError("OPENAI_API_KEY is not configured.", 503);
  }

  const formData = await request.formData();
  const zoneId = formData.get("zoneId");
  const image = formData.get("image");

  if (typeof zoneId !== "string") {
    return jsonError("zoneId is required.", 400);
  }

  const zone = getZone(zoneId);

  if (!zone) {
    return jsonError("Unknown closing zone.", 404);
  }

  if (!(image instanceof File)) {
    return jsonError("image file is required.", 400);
  }

  if (!SUPPORTED_IMAGE_TYPES.has(image.type)) {
    return jsonError("Only JPEG, PNG, and WEBP images are supported.", 415);
  }

  if (image.size > MAX_IMAGE_BYTES) {
    return jsonError("Image must be 8 MB or smaller.", 413);
  }

  const imageBuffer = Buffer.from(await image.arrayBuffer());
  const imageSha256 = createHash("sha256").update(imageBuffer).digest("hex");
  const imageDataUrl = `data:${image.type};base64,${imageBuffer.toString(
    "base64",
  )}`;
  const model = process.env.OPENAI_VISION_MODEL ?? DEFAULT_VISION_MODEL;
  const prompt = buildAiClosingEvaluationPrompt(zone);
  const openAiRequest: OpenAiResponsesRequest = {
    model,
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: prompt,
          },
          {
            type: "input_image",
            image_url: imageDataUrl,
            detail: "high",
          },
        ],
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "ai_closing_evaluation",
        schema: visionEvaluationJsonSchema,
        strict: true,
      },
    },
  };

  const auditImage = {
    sha256: imageSha256,
    size: image.size,
    type: image.type,
    name: image.name,
  };

  try {
    const openAiResponse = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(openAiRequest),
    });

    const responseBody = (await openAiResponse.json()) as unknown;

    if (!openAiResponse.ok) {
      auditVisionEvaluation({
        request: openAiRequest,
        response: responseBody,
        status: "error",
        image: auditImage,
      });

      return NextResponse.json(
        {
          error: "OpenAI vision evaluation failed.",
          details: responseBody,
        },
        { status: 502 },
      );
    }

    const outputText = extractOutputText(responseBody);
    const rawEvaluation = outputText ? safeParseJson(outputText) : undefined;
    const evaluation = normalizeVisionEvaluation(rawEvaluation, zone, model);

    auditVisionEvaluation({
      request: openAiRequest,
      response: responseBody,
      status: "success",
      image: auditImage,
    });

    return NextResponse.json(evaluation);
  } catch (error) {
    auditVisionEvaluation({
      request: openAiRequest,
      response: {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      status: "error",
      image: auditImage,
    });

    return jsonError("AI vision evaluation could not be completed.", 502);
  }
}
