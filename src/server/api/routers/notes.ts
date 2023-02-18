import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '../trpc'

export const noteRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.note.findUniqueOrThrow({
        where: {
          id: input.id
        },
        include: {
          author: {
            select: {
              id: true,
              name: true
            }
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
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string().length(24),
      title: z.string(),
      content: z.string()
    }))
    .mutation(({ ctx, input }) => {
      const authorId = ctx.session.user.id

      return ctx.prisma.note.update({
        where: {
          id: input.id
        },
        data: {
          ...input,
          authorId
        }
      })
    }),

  create: protectedProcedure
    .input(z.object({
      id: z.string().length(24),
      title: z.string(),
      content: z.string()
    }))
    .mutation(({ ctx, input }) => {
      const authorId = ctx.session.user.id

      return ctx.prisma.note.create({
        data: {
          ...input,
          authorId
        }
      })
    })
})
