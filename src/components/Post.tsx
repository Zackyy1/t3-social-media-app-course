/* eslint-disable @typescript-eslint/no-unsafe-return */
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";

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

  useEffect(() => {
    // close menu if clicked outside
    const handleClickOutside = (event: MouseEvent) => setIsPostMenuOpen(false);

    document.addEventListener("mouseup", handleClickOutside);

    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, []);

  if (!author || !content || !createdAt) return null;
  return (
    <div className="flex flex-col justify-between gap-2 rounded-md border border-slate-300/20 p-2">
      <div className="row relative flex border-b border-slate-100/10 pb-2">
        <div className="flex w-full  flex-col text-sm text-slate-300">
          <div className="flex flex-row items-center gap-2">
            <div className="h-[32px] w-[32px] rounded-full border border-slate-100/10 bg-slate-800">
              <span className="mt-[6px] block pl-[5px] text-xs font-bold uppercase">
                {author.name.substring(0, 1) +
                  author.name.substring(
                    author.name.lastIndexOf(" ") + 1,
                    author.name.lastIndexOf(" ") + 2
                  )}
              </span>
            </div>
            <Link href={`/user/${author.id}`} className="text-sm">
              {author.name}
            </Link>
          </div>
          <p>{new Date(createdAt).toLocaleDateString()}</p>
        </div>
        {isMine && (
          <button
            className="pr-2 text-xl hover:scale-110"
            onClick={() => setIsPostMenuOpen(true)}
          >
            •••
          </button>
        )}
        {isPostMenuOpen && isMine && (
          <div className="absolute right-0 top-10 flex flex-col gap-2 rounded-md border border-slate-300/10 bg-slate-700 px-4 py-2">
            <button>Edit</button>
            <button
              onMouseDown={() => {
                console.log("cLICk");
                deletePost.mutate({ id });
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
      <p className="py-4 pl-2">{content}</p>
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
