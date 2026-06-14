import { getEnv, requireEnv } from "./env";

export type PublishMediaInput = {
  publicUrl: string;
  mediaType: "image" | "video";
  sortOrder: number;
};

export type PublishInput = {
  caption: string;
  media: PublishMediaInput[];
};

export type PublishResult = {
  status: "published";
  externalPostId: string;
  externalPostUrl: string;
  activityLogMessage: string;
};

type GraphResponse = {
  id?: string;
  permalink?: string;
  error?: {
    message?: string;
    type?: string;
    code?: number;
    error_subcode?: number;
  };
};

function graphVersion() {
  return getEnv("META_GRAPH_API_VERSION") || "v24.0";
}

async function graphGet<T extends GraphResponse>(path: string, fields: string[]) {
  const accessToken = requireEnv("META_ACCESS_TOKEN");
  const url = new URL(`https://graph.facebook.com/${graphVersion()}/${path}`);
  url.searchParams.set("fields", fields.join(","));
  url.searchParams.set("access_token", accessToken);

  const response = await fetch(url);
  const data = (await response.json()) as T;

  if (!response.ok || data.error) {
    return null;
  }

  return data;
}

async function graphPost(path: string, body: Record<string, string>) {
  const accessToken = requireEnv("META_ACCESS_TOKEN");
  const url = `https://graph.facebook.com/${graphVersion()}/${path}`;
  const params = new URLSearchParams({
    ...body,
    access_token: accessToken,
  });

  const response = await fetch(url, {
    method: "POST",
    body: params,
  });
  const data = (await response.json()) as GraphResponse;

  if (!response.ok || data.error || !data.id) {
    const error = data.error;
    const details = [
      error?.message,
      error?.type,
      error?.code ? `code ${error.code}` : "",
      error?.error_subcode ? `subcode ${error.error_subcode}` : "",
    ]
      .filter(Boolean)
      .join(" · ");

    throw new Error(details || "Instagram Graph API çağrısı başarısız oldu.");
  }

  return data.id;
}

async function createImageContainer(igUserId: string, imageUrl: string, caption?: string) {
  return graphPost(`${igUserId}/media`, {
    image_url: imageUrl,
    ...(caption ? { caption } : {}),
  });
}

async function createCarouselItem(igUserId: string, imageUrl: string) {
  return graphPost(`${igUserId}/media`, {
    image_url: imageUrl,
    is_carousel_item: "true",
  });
}

async function createCarouselContainer(igUserId: string, childIds: string[], caption: string) {
  return graphPost(`${igUserId}/media`, {
    media_type: "CAROUSEL",
    children: childIds.join(","),
    caption,
  });
}

async function publishContainer(igUserId: string, creationId: string) {
  return graphPost(`${igUserId}/media_publish`, {
    creation_id: creationId,
  });
}

export async function publishToInstagram(input: PublishInput): Promise<PublishResult> {
  const igUserId = requireEnv("META_INSTAGRAM_BUSINESS_ACCOUNT_ID");
  const media = [...input.media].sort((a, b) => a.sortOrder - b.sortOrder);

  if (media.length === 0) {
    throw new Error("Yayın için en az bir medya URL'i gerekiyor.");
  }

  if (media.some((item) => item.mediaType !== "image")) {
    throw new Error("Bu ilk gerçek sürümde yalnızca görsel ve carousel paylaşımı destekleniyor.");
  }

  const creationId =
    media.length === 1
      ? await createImageContainer(igUserId, media[0].publicUrl, input.caption)
      : await createCarouselContainer(
          igUserId,
          await Promise.all(media.map((item) => createCarouselItem(igUserId, item.publicUrl))),
          input.caption,
        );

  const externalPostId = await publishContainer(igUserId, creationId);
  const publishedMedia = await graphGet<{ id?: string; permalink?: string }>(externalPostId, [
    "permalink",
  ]);

  return {
    status: "published",
    externalPostId,
    externalPostUrl: publishedMedia?.permalink || "",
    activityLogMessage: "Instagram Graph API üzerinden gerçek yayın çağrısı tamamlandı.",
  };
}
