import Link from "next/link";
import React from "react";

const Post = ({
  author,
  content,
  createdAt,
  _count,
  hideAdditionalData,
}: PostProps) => {
  if (!author || !content || !createdAt) return null;
  return (
    <div className="flex flex-col justify-between gap-2 rounded-md border border-slate-300/20 p-2">
      <div className="flex flex-row items-center justify-between border-b border-slate-100/10 pb-2 text-sm text-slate-300">
        <div className="flex flex-row items-center gap-2">
          <div className="h-[32px] w-[32px] rounded-full border border-slate-100/10 bg-slate-800">
            <span className="mt-[6px] block pl-[8px] text-xs font-bold uppercase">
              {author.name.substring(0, 1) +
                author.name.substring(
                  author.name.indexOf(" ") + 1,
                  author.name.indexOf(" ") + 2
                )}
            </span>
          </div>
          <p className="text-sm">{author.name}</p>
        </div>
        <p>{new Date(createdAt).toLocaleDateString()}</p>
      </div>
      <p className="py-4 pl-2">{content}</p>
      {!hideAdditionalData && (
        <div className="flex  flex-row justify-end text-sm text-slate-300">
          <p>{_count.comments} comments</p>
        </div>
      )}
    </div>
  );
};

export default Post;
