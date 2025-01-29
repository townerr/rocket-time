import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { startOfWeek, endOfWeek } from "date-fns";

export const timesheetRouter = createTRPCRouter({
  getCurrentTimesheet: protectedProcedure
    .input(z.object({ weekStart: z.date() }))
    .query(async ({ ctx, input }) => {
      const weekStart = startOfWeek(input.weekStart, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(input.weekStart, { weekStartsOn: 1 });

      let timesheet = await ctx.db.timesheet.findFirst({
        where: {
          userId: ctx.session.user.id,
          weekStart,
          weekEnd,
        },
        include: {
          entries: {
            include: {
              type: true,
            },
            orderBy: {
              date: 'asc',
            },
          },
        },
      });

      if (!timesheet) {
        timesheet = await ctx.db.timesheet.create({
          data: {
            userId: ctx.session.user.id,
            weekStart,
            weekEnd,
            status: null,
          },
          include: {
            entries: {
              include: {
                type: true,
              },
            },
          },
        });
      }

      return timesheet;
    }),

  getWorkTypes: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.db.workType.findMany({
        orderBy: {
          name: 'asc',
        },
      });
    }),

  saveEntry: protectedProcedure
    .input(z.object({
      id: z.string().optional(),
      timesheetId: z.string(),
      date: z.date(),
      workTypeId: z.string(),
      hours: z.number(),
      projectCode: z.string().optional().nullable(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (input.id) {
        return ctx.db.entry.update({
          where: { id: input.id },
          data: {
            date: input.date,
            workTypeId: input.workTypeId,
            hours: input.hours,
            projectCode: input.projectCode,
          },
          include: {
            type: true,
          },
        });
      }

      return ctx.db.entry.create({
        data: {
          timesheetId: input.timesheetId,
          date: input.date,
          workTypeId: input.workTypeId,
          hours: input.hours,
          projectCode: input.projectCode,
        },
        include: {
          type: true,
        },
      });
    }),

  deleteEntry: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.entry.delete({
        where: { id: input.id },
      });
    }),

  submitTimesheet: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.timesheet.update({
        where: { id: input.id },
        data: {
          status: 'pending',
        },
      });
    }),
}); 