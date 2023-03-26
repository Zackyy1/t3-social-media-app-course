/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { Comment, Post } from "@prisma/client";

import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import {
  getAllPostsWithCommentsCount,
  getOnePostWithCommentsCount,
} from "@/utils/ServerFunctions";

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.content)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email is required",
        });

      return (await ctx.prisma.post.create({
        data: {
          content: input.content,
          author: {
            connect: {
              id: ctx.session?.user.id,
            },
          },
        },
      })) as unknown as Post;
    }),

  getAll: publicProcedure.query(async () => {
    return (await getAllPostsWithCommentsCount()) as unknown as PostProps[];
  }),

  getOne: publicProcedure.query(async ({ input }) => {
    if (!input || !(input as any).id) return;

    return (await getOnePostWithCommentsCount(
      (input as any).id
    )) as unknown as PostProps;
  }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log("yee haw");
      if (!input.id)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Id is required",
        });

      if (!ctx.session?.user.id)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User is not logged in",
        });

      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.id,
        },
        include: {
          author: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!post) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Post not found",
        });
      }

      if (ctx.session?.user.id !== post.author.id)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User is not authorized to delete this post",
        });

      try {
        return (await ctx.prisma.post.delete({
          where: {
            id: post.id,
          },
        })) as unknown as Post;
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Something went wrong",
        });
      }
    }),

  addComment: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.content)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Content is required",
        });

      return (await ctx.prisma.comment.create({
        data: {
          content: input.content,
          post: {
            connect: {
              id: input.postId,
            },
          },
          author: {
            connect: {
              id: ctx.session?.user.id,
            },
          },
        },
      })) as unknown as Comment;
    }),

  getComments: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return (await ctx.prisma.comment.findMany({
        where: {
          postId: input.postId,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: true,
        },
      })) as unknown as CommentProps[];
    }),
});
