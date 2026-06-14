import type { Config } from "@netlify/functions";
import { publishToInstagram, type PublishMediaInput } from "./_shared/instagram";
import { errorResponse, jsonResponse } from "./_shared/responses";

type PublishNowPayload = {
  title?: string;
  caption: string;
  hashtags?: string;
  media: PublishMediaInput[];
};

function buildCaption(payload: PublishNowPayload) {
  return [payload.caption, payload.hashtags].filter(Boolean).join("\n\n").trim();
}

const publishNow = async (req: Request) => {
  if (req.method !== "POST") {
    return errorResponse("Bu endpoint yalnızca POST kabul eder.", 405);
  }

  try {
    const payload = (await req.json()) as PublishNowPayload;
    const result = await publishToInstagram({
      caption: buildCaption(payload),
      media: payload.media,
    });

    return jsonResponse({ ok: true, result });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Gerçek yayın başarısız oldu.", 500);
  }
};

export default publishNow;

export const config: Config = {
  path: "/api/publish-now",
};
