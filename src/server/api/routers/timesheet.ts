import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const timesheetRouter = createTRPCRouter({
  getTimesheet: protectedProcedure
    .input(z.object({
      weekStart: z.date(),
      weekEnd: z.date(),
    }))
    .query(async ({ ctx, input }) => {
      const timesheet = await ctx.db.timesheet.findFirst({
        where: {
          userId: ctx.session.user.id,
          weekStart: input.weekStart,
          weekEnd: input.weekEnd,
        },
        include: {
          entries: true,
        },
      });

      if (!timesheet) {
        return ctx.db.timesheet.create({
          data: {
            userId: ctx.session.user.id,
            weekStart: input.weekStart,
            weekEnd: input.weekEnd,
          },
          include: {
            entries: true,
          },
        });
      }

      return timesheet;
    }),

  saveTimesheet: protectedProcedure
    .input(z.object({
      id: z.string(),
      status: z.string().nullable(),
      weekStart: z.date(),
      weekEnd: z.date(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.timesheet.upsert({
        where: {
          id: input.id,
        },
        update: {
          status: input.status,
        },
        create: {
          userId: ctx.session.user.id,
          weekStart: input.weekStart,
          weekEnd: input.weekEnd,
          status: input.status,
        },
        include: {
          entries: true,
        },
      });
    }),

  addEntry: protectedProcedure
    .input(z.object({
      timesheetId: z.string(),
      date: z.date(),
      type: z.string(),
      projectCode: z.string().optional(),
      hours: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify timesheet belongs to user
      const timesheet = await ctx.db.timesheet.findFirst({
        where: {
          id: input.timesheetId,
          userId: ctx.session.user.id,
        },
      });

      if (!timesheet) {
        throw new Error("Timesheet not found");
      }

      return ctx.db.entry.create({
        data: {
          timesheetId: input.timesheetId,
          date: input.date,
          type: input.type,
          projectCode: input.projectCode,
          hours: input.hours,
        },
      });
    }),
}); 