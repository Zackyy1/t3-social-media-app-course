import type { Post } from "@prisma/client";

import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import {
  getAllPostsDetailed,
  getOnePostDetailed,
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
    return (await getAllPostsDetailed()) as unknown as PostProps[];
  }),

  getOne: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      if (!input || !input.id) return;

      return (await getOnePostDetailed(
        input.id
      )) as unknown as PostProps;
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

      const post = (await ctx.prisma.post.findUnique({
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
      })) as Post;

      if (!post) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Post not found",
        });
      }

      if (ctx.session?.user.id !== post.authorId)
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

      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!post)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "post not found",
        });

      const like = await ctx.prisma.like.findFirst({
        where: {
          AND: [
            {
              postId: post.id,
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
            post: {
              connect: {
                id: post.id,
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
