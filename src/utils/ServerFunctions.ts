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
