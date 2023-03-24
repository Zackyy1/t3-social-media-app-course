import { api } from "@/utils/api";
import React, { useRef } from "react";

const NewPostForm = () => {
  const submitPost = api.post.create.useMutation();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!inputRef || !inputRef.current || inputRef.current?.value === "")
      return;

    submitPost.mutate({ content: inputRef.current?.value });
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-row justify-between gap-2 py-2">
      <input
        ref={inputRef}
        placeholder="New post"
        className="h-10 w-full rounded-md bg-slate-700 p-2 focus:outline-none"
        type="text"
      />
      <button
        onClick={() => handleSubmit()}
        className="rounded-md border border-slate-400 p-2 hover:bg-slate-700/20"
      >
        Submit
      </button>
    </div>
  );
};

export default NewPostForm;
