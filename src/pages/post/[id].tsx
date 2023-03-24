import NewCommentForm from "@/components/NewCommentForm";
import Post from "@/components/Post";
import { api } from "@/utils/api";
import { getOnePostWithCommentsCount } from "@/utils/ServerFunctions";
import type { GetServerSidePropsContext } from "next";
import React from "react";

import Comment from "@/components/Comment";

interface PostPageProps {
  post: PostProps;
  refreshComments: () => void;
}

const PostPage = ({ post, refreshComments }: PostPageProps) => {
  const comments = api.post.getComments.useQuery({ postId: post.id });

  return (
    <div className="flex flex-col gap-4">
      <Post {...post} hideAdditionalData />
      <NewCommentForm postId={post.id} refreshComments={refreshComments} />
      {comments.data && comments.data.length ? (
        <>
        <h2 className="font-bold ml-1">Comments</h2>
          <div className="flex flex-col gap-2">
            {comments.data.map((comment, index: number) => (
              <Comment key={index} {...comment} />
            ))}
          </div>
        </>
      ) : (
        <p>No comments yet</p>
      )}
    </div>
  );
};

export default PostPage;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { id } = context.query;
  const post = (await getOnePostWithCommentsCount(
    id as string
  )) as unknown as PostProps;

  return {
    props: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      post: JSON.parse(JSON.stringify(post)),
    },
  };
};
