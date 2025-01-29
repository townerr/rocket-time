import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const managerRouter = createTRPCRouter({
  getEmployees: protectedProcedure
    .query(async ({ ctx }) => {
      const employees = await ctx.db.user.findMany({
        where: {
          managerId: ctx.session.user.id,
        },
        orderBy: {
          name: 'asc',
        },
      });
      
      return employees;
    }),

  getEmployeeBalances: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const employee = await ctx.db.user.findFirst({
        where: {
          id: input.userId,
          managerId: ctx.session.user.id,
        },
        include: {
          balances: true,
        },
      });
      
      return employee?.balances;
    }),

  getEmployeeTimesheets: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const employee = await ctx.db.user.findFirst({
        where: {
          id: input.userId,
          managerId: ctx.session.user.id,
        },
      });
      
      if (!employee) return [];
      
      const timesheets = await ctx.db.timesheet.findMany({
        where: {
          userId: input.userId,
        },
        include: {
          entries: true,
        },
        orderBy: {
          weekStart: 'desc',
        },
      });
      
      return timesheets;
    }),
}); 