import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '../trpc'

export const exampleRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.note.findUnique({
        select: {
          id: true,
          title: true,
          content: true
        },
        where: {
          id: input.id,
          AND: {
            authorId: ctx.session.user.id
          }
        }
      })
    }),

  getAll: protectedProcedure
    .query(({ ctx }) => {
      const authorId = ctx.session.user.id

      return ctx.prisma.note.findMany({
        where: {
          authorId
        }
      })
    })
})
