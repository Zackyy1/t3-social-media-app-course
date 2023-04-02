/* eslint-disable @typescript-eslint/no-unsafe-return */
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import Likes from "./Likes";
import ThreeDotsButton from "./ThreeDotsButton";
import UtilityMenuDropdown from "./UtilityMenuDropdown";

const Post = ({
  author,
  content,
  createdAt,
  _count,
  id,
  hideAdditionalData,
  refreshCallback,
}: PostProps) => {
  const { data: session } = useSession();

  const isMine = author.id === session?.user?.id;
  const [isPostMenuOpen, setIsPostMenuOpen] = useState(false);

  const deletePost = api.post.delete.useMutation({
    onSuccess: () => {
      refreshCallback && refreshCallback();
    },
  });

  if (!author || !content || !createdAt) return null;
  return (
    <div className="flex flex-col justify-between gap-2 rounded-md border border-slate-300/20 p-2">
      <div className="row relative flex border-b border-slate-100/10 pb-2">
        <div className="flex w-full  flex-col text-sm text-slate-300">
          <div className="flex flex-row items-center gap-2">
            <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full border border-slate-100/10 bg-slate-800">
              <span className=" block text-xs font-bold uppercase">
                {author.name.substring(0, 1) +
                  author.name.substring(
                    author.name.lastIndexOf(" ") + 1,
                    author.name.lastIndexOf(" ") + 2
                  )}
              </span>
            </div>
            <div className="flex flex-col">
              <Link href={`/user/${author.id}`} className="text-sm">
                {author.name}
              </Link>
              <p className="text-xs">
                {new Date(createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        {isMine && <ThreeDotsButton onClick={() => setIsPostMenuOpen(true)} />}
        {isPostMenuOpen && isMine && (
          <UtilityMenuDropdown
            closeMenu={() => setIsPostMenuOpen(false)}
            editCallback={() => console.log("Edit...")}
            deleteCallback={() => deletePost.mutate({ id })}
          />
        )}
      </div>
      <p className="py-4 pl-2">{content}</p>
      {/* <Likes count={} /> */}
      {!hideAdditionalData && (
        <div className="flex  flex-row justify-end text-sm text-slate-300">
          <Link className="underline" href={`/post/${id}`}>
            {_count.comments} comments
          </Link>
        </div>
      )}
    </div>
  );
};

export default Post;
