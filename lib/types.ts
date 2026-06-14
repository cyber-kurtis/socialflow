export type UserRole = "admin" | "editor" | "approver" | "viewer";

export type TeamMemberStatus = "active" | "invited" | "disabled";

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: TeamMemberStatus;
  createdAt: string;
  updatedAt: string;
};

export type PostStatus =
  | "draft"
  | "pending_approval"
  | "revision_requested"
  | "approved"
  | "scheduled"
  | "publishing"
  | "published"
  | "failed"
  | "rejected"
  | "cancelled";

export type PostType = "single_image" | "carousel" | "video" | "reels";

export type SocialAccount = {
  id: string;
  name: string;
  handle: string;
  brand: string;
  avatarFallback: string;
};

export type DemoPost = {
  id: string;
  title: string;
  account: SocialAccount;
  status: PostStatus;
  postType: PostType;
  scheduledAt: string;
  caption: string;
  mediaPreview: string;
};

export type ActivityLog = {
  id: string;
  title: string;
  description: string;
  time: string;
};

export type StatusDistributionItem = {
  status: PostStatus;
  label: string;
  count: number;
  colorClass: string;
};

export type UploadedMedia = {
  id: string;
  file: File;
  previewUrl: string;
  sortOrder: number;
  mediaType: "image" | "video";
};

export type SavedDraftMedia = {
  id: string;
  fileName: string;
  fileSize: number;
  mediaType: "image" | "video";
  sortOrder: number;
};

export type SavedDraftPost = {
  id: string;
  title: string;
  account: SocialAccount;
  postType: PostType;
  caption: string;
  hashtags: string;
  firstComment: string;
  publishDate: string;
  publishTime: string;
  timezone: string;
  status: PostStatus;
  media: SavedDraftMedia[];
  publishedAt?: string;
  externalPostId?: string;
  externalPostUrl?: string;
  failureReason?: string;
  activityLogMessage?: string;
  lastPublishingAttemptAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type MockPublishResult = {
  status: "published" | "failed";
  externalPostId?: string;
  externalPostUrl?: string;
  failureReason?: string;
  activityLogMessage: string;
};
