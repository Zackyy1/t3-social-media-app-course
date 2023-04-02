import { prisma } from "@/server/db";

const commentsAndLikesCountQuery = {
  select: {
    content: true,
    createdAt: true,
    id: true,
    _count: {
      select: {
        comments: true,
        likes: true,
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

export const getAllPostsDetailed = async () =>
  prisma.post.findMany({
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
    ...commentsAndLikesCountQuery,
  });

export const getOnePostDetailed = async (postId: string) =>
  prisma.post.findUnique({
    where: {
      id: postId,
    },
    ...commentsAndLikesCountQuery,
  });

export const getUserById = async (userId: string) =>
  await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      posts: commentsAndLikesCountQuery,
      name: true,
      id: true,
      email: true,
      _count: {
        select: {
          friends: true,
          friendOf: true,
          comments: true,
          posts: true,
        },
      },
    },
  });
