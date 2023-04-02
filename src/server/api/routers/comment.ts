import type { Comment } from "@prisma/client";

import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const commentRouter = createTRPCRouter({
  create: protectedProcedure
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

  getAll: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const comments = await ctx.prisma.comment.findMany({
        where: {
          postId: input.postId,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: true,
          _count: {
            select: {
              likes: true,
            },
          },
          likes: {
            where: {
              byId: ctx.session?.user.id,
            },
          },
        },
      });

      return comments.map((comment) => {
        return {
          ...comment,
          isLikedByMe: comment.likes.length > 0,
        };
      }) as unknown as CommentProps[];
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
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

      const comment = (await ctx.prisma.comment.findUnique({
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
      })) as Comment;

      if (ctx.session?.user.id !== comment.authorId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User is not authorized to delete this comment",
        });

      return await ctx.prisma.comment.delete({
        where: {
          id: input.id,
        },
      });
    }),

    like: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
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

      const comment = await ctx.prisma.comment.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!comment)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Comment not found",
        });

      const like = await ctx.prisma.like.findFirst({
        where: {
          AND: [
            {
              commentId: comment.id,
            },
            {
              byId: ctx.session?.user.id,
            },
          ],
        },
      });

      if (like) {
        await ctx.prisma.like.delete({
          where: {
            id: like.id,
          },
        });

        return -1;
      } else {
        await ctx.prisma.like.create({
          data: {
            comment: {
              connect: {
                id: comment.id,
              },
            },
            by: {
              connect: {
                id: ctx.session?.user.id,
              },
            },
          },
        });

        return 1;
      }
    }),
});
