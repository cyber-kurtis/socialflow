import { CalendarClock } from "lucide-react";
import type { DemoPost } from "@/lib/types";
import { statusLabels } from "@/lib/mock-data";

export function UpcomingPostCard({ post }: { post: DemoPost }) {
  return (
    <article className="flex gap-3 rounded-lg border border-slate-200 bg-white p-3">
      <div
        className="h-16 w-16 shrink-0 rounded-md border border-slate-200"
        style={{ background: post.mediaPreview }}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-slate-950">{post.title}</h3>
            <p className="mt-1 text-xs text-slate-500">
              {post.account.handle} · {post.postType.replace("_", " ")}
            </p>
          </div>
          <span className="w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
            {statusLabels[post.status]}
          </span>
        </div>
        <p className="mt-2 line-clamp-1 text-sm text-slate-600">{post.caption}</p>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
          <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
          {post.scheduledAt}
        </div>
      </div>
    </article>
  );
}
