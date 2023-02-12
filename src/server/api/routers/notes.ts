import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const exampleRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.note.findUnique({
        select: {
          id: true,
          title: true,
          content: true,
        },
        where: {
          id: input.id,
        }
      });
    }),

  getAll: protectedProcedure
    .query(({ ctx }) => {
      return ctx.prisma.example.findMany();
    }),
});
