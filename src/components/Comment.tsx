import { api } from "@/utils/api";

import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import Likes from "./Likes";
import ThreeDotsButton from "./ThreeDotsButton";
import UtilityMenuDropdown from "./UtilityMenuDropdown";

const Comment = ({
  author,
  content,
  id,
  createdAt,
  _count,
  isLikedByMe,
  refreshCallback,
}: CommentProps) => {
  const { data: session } = useSession();
  const [isCommentMenuOpen, setIsCommentMenuOpen] = useState(false);

  const deleteComment = api.comment.delete.useMutation({
    onSuccess: () => {
      if (refreshCallback) refreshCallback();
    },
  });

  const isMine = author.id === session?.user?.id;

  return (
    <div className="rounded-xl border border-slate-300/10 p-4">
      <div className="relative flex flex-row justify-between border-b border-slate-100/10 pb-2">
        <div>
          <p className=" text-sm text-slate-300 ">
            By{" "}
            <Link className="underline" href={`/user/${author.id}`}>
              {author.name}
            </Link>
          </p>
        </div>

        {isMine && (
          <ThreeDotsButton onClick={() => setIsCommentMenuOpen(true)} />
        )}

        {isCommentMenuOpen && isMine && (
          <UtilityMenuDropdown
            closeMenu={() => setIsCommentMenuOpen(false)}
            editCallback={() => console.log("Edit...")}
            deleteCallback={() => deleteComment.mutate({ id })}
          />
        )}
      </div>

      <p className="mt-2">{content}</p>

      <div className="mt-2 flex flex-row justify-between">
        <Likes
          isLikedByMe={isLikedByMe || false}
          count={_count?.likes || 0}
          commentId={id}
          refreshCallback={refreshCallback}
        />

        <p className="mt-2 text-right text-xs text-slate-300">
          {new Date(createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default Comment;
