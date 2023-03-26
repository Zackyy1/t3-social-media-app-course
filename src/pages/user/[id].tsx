/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Post from "@/components/Post";
import { getUserById } from "@/utils/ServerFunctions";
import type { GetServerSidePropsContext } from "next";
import Link from "next/link";
import React from "react";

interface UserPageProps {
  user: UserProps;
}

const UserProfilePage = ({ user }: UserPageProps) => {
  console.log(user);

  if (!user || !user.posts) {
    return null;
  }

  return (
    <div>
      <div className="grid grid-cols-2">
        <h1>{user.name}</h1>
        <div className="text-right">
          <p>Friends: {user["_count"]?.friends} </p>
          <p>Posts: {user["_count"]?.posts} </p>
          <p>Comments: {user["_count"]?.comments} </p>
        </div>
      </div>
      {user?.posts?.length ? (
        <div className="mt-4 flex flex-col gap-4 border-t border-slate-300/10 pt-2">
          <p className="text-lg font-bold">Posts</p>
          {user.posts.map((post, index) => (
            <Post key={index} {...post} />
          ))}
        </div>
      ) : (
        <p>No posts</p>
      )}
    </div>
  );
};

export default UserProfilePage;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { id } = context.query;

  if (!id) {
    return {
      notFound: true,
    };
  }

  const user = await getUserById(id as string);

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
    },
  };
};
