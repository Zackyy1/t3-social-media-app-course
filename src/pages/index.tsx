/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";

import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import NewPostForm from "@/components/NewPostForm";
import Post from "@/components/Post";
import Link from "next/link";

const Home: NextPage = () => {
  const { data: session } = useSession();

  const latestPosts = api.post.getAll.useQuery();

  console.log(latestPosts.data);

  return (
    <>
      {session && <NewPostForm refreshPosts={() => latestPosts.refetch()} />}
      <div className="flex flex-col gap-2">
        {latestPosts.data?.length ? (
          latestPosts.data.map((post, index: number) => (
            <Post refreshCallback={() => latestPosts.refetch()} key={index} {...post} />
          ))
        ) : (
          <p>No posts yet</p>
        )}
      </div>
    </>
  );
};

export default Home;
