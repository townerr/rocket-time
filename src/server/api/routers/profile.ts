import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        name: true,
        email: true,
        image: true,
        isManager: true,
        managerId: true,
      },
    });

    let managerInfo = null;
    if (profile?.managerId) {
      managerInfo = await ctx.db.user.findUnique({
        where: { id: profile.managerId },
        select: {
          firstname: true,
          lastname: true,
        },
      });
    }

    return { ...profile, managerInfo };
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        firstname: z.string().min(1),
        lastname: z.string().min(1),
        name: z.string().min(1),
        email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verify user is a manager
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { isManager: true },
      });

      if (!user?.isManager) {
        throw new Error("Unauthorized: Only managers can update profiles");
      }

      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: input,
      });
    }),

  getBalances: protectedProcedure
    .query(async ({ ctx }) => {
      // Get balances
      const balances = await ctx.db.balance.findUnique({
        where: {
          userId: ctx.session.user.id,
        },
      });

      // Get leave history from timesheet entries
      const history = await ctx.db.entry.findMany({
        where: {
          timesheet: {
            userId: ctx.session.user.id,
          },
          type: {
            name: {
              in: ['Vacation', 'Sick'],
            },
          },
        },
        include: {
          timesheet: true,
          type: true,
        },
        orderBy: {
          date: 'desc',
        },
      });

      // Create default balances if none exist
      const finalBalances = balances ?? await ctx.db.balance.create({
        data: {
          userId: ctx.session.user.id,
          vacation: 120,
          sick: 40,
        },
      });

      return {
        balances: finalBalances,
        history,
      };
    }),

  getTimesheetHistory: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.timesheet.findMany({
      where: {
        userId: ctx.session.user.id,
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
      orderBy: {
        weekStart: 'desc',
      },
    });
  }),

  getLeaveHistory: protectedProcedure
    .query(async ({ ctx }) => {
      const leaveEntries = await ctx.db.entry.findMany({
        where: {
          timesheet: {
            userId: ctx.session.user.id,
          },
          type: {
            name: {
              in: ['Vacation', 'Sick']
            }
          }
        },
        include: {
          timesheet: {
            select: {
              weekStart: true,
              weekEnd: true,
              status: true,
            }
          },
          type: {
            select: {
              name: true,
              color: true,
            }
          }
        },
        orderBy: [
          {
            date: 'desc',
          }
        ],
      });

      return leaveEntries;
    }),
}); 