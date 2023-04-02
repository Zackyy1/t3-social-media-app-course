import { api } from "@/utils/api";
import React, { useRef } from "react";

interface NewCommentFormProps {
  postId: string;
  refreshComments: () => void;
}

const NewCommentForm = ({ postId, refreshComments }: NewCommentFormProps) => {
  const newPost = api.comment.create.useMutation({
    onSuccess: () => {
      refreshComments();
    },
  });
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const postNewComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = inputRef.current?.value;
    if (content) {
      newPost.mutate({ postId, content });
      inputRef.current.value = "";
    }
  };

  return (
    <div className="relative mt-2 overflow-hidden rounded-lg border border-slate-100/10 px-4 py-2 pb-16">
      <h2 className="mb-2 border-b border-slate-100/10 py-2 font-bold">
        Post a comment
      </h2>
      <form onSubmit={(event) => postNewComment(event)}>
        <textarea
          ref={inputRef}
          className="hide-scrollbar h-auto w-full resize-none overflow-auto bg-transparent  focus:outline-none"
          placeholder="Type your comment here..."
          name="content"
          id="content"
          rows={4}
        />
        <button
          className="absolute bottom-2 right-2 block rounded-xl border border-sky-700 px-3 py-2"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewCommentForm;
