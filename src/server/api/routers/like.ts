import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const likeRouter = createTRPCRouter({
  likeComment: protectedProcedure
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
