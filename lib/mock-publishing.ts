import type { MockPublishResult } from "@/lib/types";

export async function simulatePublishing(postTitle: string): Promise<MockPublishResult> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const success = Math.random() > 0.18;
  const slug = postTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);

  if (!success) {
    return {
      status: "failed",
      failureReason: "Simülasyon servisi bu denemeyi başarısız olarak işaretledi.",
      activityLogMessage: "publishing_attempts ve activity_logs için başarısız deneme üretildi.",
    };
  }

  const externalPostId = `mock_${Date.now()}`;

  return {
    status: "published",
    externalPostId,
    externalPostUrl: `https://instagram.com/p/${slug || externalPostId}`,
    activityLogMessage: "publishing_attempts ve activity_logs için başarılı deneme üretildi.",
  };
}
