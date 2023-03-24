import React from "react";

const Comment = ({ author, content, createdAt }: CommentProps) => {
  return (
    <div className="rounded-xl border border-slate-300/10 p-4">
      <div className="flex flex-row justify-between">
        <p className="mb-2 text-xs text-slate-300">By {author.name}</p>
        <p className="mb-2 text-xs text-slate-300">{new Date(createdAt).toLocaleDateString()}</p>
      </div>
      <p>{content}</p>
    </div>
  );
};

export default Comment;
