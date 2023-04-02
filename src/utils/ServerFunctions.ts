import { prisma } from "@/server/db";

const postWithCommentCountQuery = {
  select: {
    content: true,
    createdAt: true,
    id: true,
    _count: {
      select: {
        comments: true,
      },
    },
    author: {
      select: {
        name: true,
        id: true,
      },
    },
  },
};

export const getAllPostsWithCommentsCount = async () =>
  prisma.post.findMany({
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
    ...postWithCommentCountQuery,
  });

export const getOnePostWithCommentsCount = async (postId: string) =>
  prisma.post.findUnique({
    where: {
      id: postId,
    },
    ...postWithCommentCountQuery,
  });

export const getUserById = async (userId: string) =>
  await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      posts: postWithCommentCountQuery,
      name: true,
      id: true,
      email: true,
      _count: {
        select: {
          friends: true,
          friendOf: true,
          comments: true,
          posts: true
        },
      },
    },
  });
