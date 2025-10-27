import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const managerRouter = createTRPCRouter({
  getEmployees: protectedProcedure.query(async ({ ctx }) => {
    const employees = await ctx.db.user.findMany({
      where: {
        managerId: ctx.session.user.id,
      },
      orderBy: {
        name: "asc",
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
          weekStart: "desc",
        },
      });

      return timesheets;
    }),

  // New route to get all employee timesheets for the manager
  getAllEmployeeTimesheets: protectedProcedure.query(async ({ ctx }) => {
    // First get all employees under this manager
    const employees = await ctx.db.user.findMany({
      where: {
        managerId: ctx.session.user.id,
      },
      select: {
        id: true,
      },
    });

    const employeeIds = employees.map((emp) => emp.id);

    // Then get all their timesheets
    const timesheets = await ctx.db.timesheet.findMany({
      where: {
        userId: {
          in: employeeIds,
        },
      },
      include: {
        entries: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        weekStart: "desc",
      },
    });

    return timesheets;
  }),

  // ------- ANALYTICS ROUTES -------

  // Get hours per employee within date range
  getEmployeeHoursStats: protectedProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      console.log("getEmployeeHoursStats called with date range:", {
        startDate: input.startDate.toISOString(),
        endDate: input.endDate.toISOString(),
      });

      // First get all employees under this manager
      const employees = await ctx.db.user.findMany({
        where: {
          managerId: ctx.session.user.id,
        },
        select: {
          id: true,
          name: true,
        },
      });

      // Also get the manager's own info
      const manager = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          id: true,
          name: true,
        },
      });

      console.log(`Found ${employees.length} employees under this manager`);

      // Add the manager to the list of users we're checking
      const allUsers = [manager, ...employees].filter(Boolean);
      const userIds = allUsers
        .map((user) => user?.id)
        .filter(Boolean) as string[];

      console.log(
        `Analyzing timesheets for ${userIds.length} users (manager + employees)`,
      );

      // Get all timesheets in the date range
      // NOTE: We're changing the date comparison logic to be more inclusive
      const timesheets = await ctx.db.timesheet.findMany({
        where: {
          userId: {
            in: userIds,
          },
          // Either the timesheet start date is within our range
          OR: [
            {
              weekStart: {
                gte: input.startDate,
                lte: input.endDate,
              },
            },
            // Or the timesheet end date is within our range
            {
              weekEnd: {
                gte: input.startDate,
                lte: input.endDate,
              },
            },
            // Or the timesheet spans our entire range
            {
              weekStart: {
                lte: input.startDate,
              },
              weekEnd: {
                gte: input.endDate,
              },
            },
          ],
        },
        include: {
          entries: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      console.log(
        `Found ${timesheets.length} timesheets in the selected date range`,
      );

      // Calculate total hours per user (employee or manager)
      const userHoursMap = new Map();

      // Initialize with 0 hours for all users
      allUsers.forEach((user) => {
        if (user && user.id) {
          userHoursMap.set(user.id, {
            name: user.name || "Unknown",
            hours: 0,
          });
        }
      });

      // Add up hours from timesheets
      timesheets.forEach((timesheet) => {
        const totalHours = timesheet.entries.reduce(
          (sum, entry) => sum + entry.hours,
          0,
        );
        const userId = timesheet.userId;

        if (userHoursMap.has(userId)) {
          const userData = userHoursMap.get(userId);
          userData.hours += totalHours;
          userHoursMap.set(userId, userData);
        }
      });

      // Convert to array and sort by hours (descending)
      const result = Array.from(userHoursMap.values())
        // Removed the filter to see ALL users, even with 0 hours
        .sort((a, b) => b.hours - a.hours);

      console.log(
        `Returning data for ${result.length} users with hours:`,
        result,
      );
      return result;
    }),

  // Get project distribution within date range
  getProjectDistribution: protectedProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      console.log("getProjectDistribution called with date range:", {
        startDate: input.startDate.toISOString(),
        endDate: input.endDate.toISOString(),
      });

      // First get all employees under this manager
      const employees = await ctx.db.user.findMany({
        where: {
          managerId: ctx.session.user.id,
        },
        select: {
          id: true,
        },
      });

      // Include the manager as well
      const userIds = [ctx.session.user.id, ...employees.map((emp) => emp.id)];

      console.log(
        `Analyzing projects for ${userIds.length} users (manager + employees)`,
      );

      // Get all timesheets in the date range with improved date range handling
      const timesheets = await ctx.db.timesheet.findMany({
        where: {
          userId: {
            in: userIds,
          },
          // Either the timesheet start date is within our range
          OR: [
            {
              weekStart: {
                gte: input.startDate,
                lte: input.endDate,
              },
            },
            // Or the timesheet end date is within our range
            {
              weekEnd: {
                gte: input.startDate,
                lte: input.endDate,
              },
            },
            // Or the timesheet spans our entire range
            {
              weekStart: {
                lte: input.startDate,
              },
              weekEnd: {
                gte: input.endDate,
              },
            },
          ],
        },
        include: {
          entries: true,
        },
      });

      console.log(
        `Found ${timesheets.length} timesheets with ${timesheets.reduce((count, ts) => count + ts.entries.length, 0)} entries`,
      );

      // Calculate total hours per project
      const projectMap = new Map();

      // Add up hours from timesheet entries
      timesheets.forEach((timesheet) => {
        timesheet.entries.forEach((entry) => {
          const projectCode = entry.projectCode || "Unassigned";

          if (projectMap.has(projectCode)) {
            projectMap.set(
              projectCode,
              projectMap.get(projectCode) + entry.hours,
            );
          } else {
            projectMap.set(projectCode, entry.hours);
          }
        });
      });

      // Convert to array format for charts
      const result = Array.from(projectMap.entries())
        .map(([name, value]) => ({ name, value }))
        // Removed filter to see all projects
        .sort((a, b) => b.value - a.value);

      console.log(`Returning data for ${result.length} projects:`, result);
      return result;
    }),

  // Get timesheet status distribution within date range
  getTimesheetStatusStats: protectedProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      console.log("getTimesheetStatusStats called with date range:", {
        startDate: input.startDate.toISOString(),
        endDate: input.endDate.toISOString(),
      });

      // First get all employees under this manager
      const employees = await ctx.db.user.findMany({
        where: {
          managerId: ctx.session.user.id,
        },
        select: {
          id: true,
        },
      });

      // Include the manager as well
      const userIds = [ctx.session.user.id, ...employees.map((emp) => emp.id)];

      console.log(
        `Analyzing timesheet statuses for ${userIds.length} users (manager + employees)`,
      );

      // Get all timesheets in the date range with improved date range handling
      const timesheets = await ctx.db.timesheet.findMany({
        where: {
          userId: {
            in: userIds,
          },
          // Either the timesheet start date is within our range
          OR: [
            {
              weekStart: {
                gte: input.startDate,
                lte: input.endDate,
              },
            },
            // Or the timesheet end date is within our range
            {
              weekEnd: {
                gte: input.startDate,
                lte: input.endDate,
              },
            },
            // Or the timesheet spans our entire range
            {
              weekStart: {
                lte: input.startDate,
              },
              weekEnd: {
                gte: input.endDate,
              },
            },
          ],
        },
      });

      console.log(`Found ${timesheets.length} timesheets for status analysis`);

      // Calculate counts for each status
      const statusCounts = {
        draft: 0,
        pending: 0,
        approved: 0,
      };

      timesheets.forEach((timesheet) => {
        if (!timesheet.status || timesheet.status === "") {
          statusCounts.draft += 1;
        } else if (timesheet.status === "pending") {
          statusCounts.pending += 1;
        } else if (timesheet.status === "approved") {
          statusCounts.approved += 1;
        }
      });

      console.log("Status counts:", statusCounts);

      // Format for charts - always return all three statuses even if they're zero
      const result = [
        { name: "Draft", value: statusCounts.draft },
        { name: "Pending Approval", value: statusCounts.pending },
        { name: "Approved", value: statusCounts.approved },
      ];

      console.log("Returning status data:", result);
      return result;
    }),

  // Route to approve a timesheet
  approveTimesheet: protectedProcedure
    .input(z.object({ timesheetId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Get the timesheet to verify it belongs to an employee of this manager
      const timesheet = await ctx.db.timesheet.findUnique({
        where: {
          id: input.timesheetId,
        },
        include: {
          user: true,
        },
      });

      if (!timesheet) {
        throw new Error("Timesheet not found");
      }

      // Verify the timesheet belongs to an employee of this manager
      if (timesheet.user.managerId !== ctx.session.user.id) {
        throw new Error("Unauthorized");
      }

      // Update the timesheet status
      const updatedTimesheet = await ctx.db.timesheet.update({
        where: {
          id: input.timesheetId,
        },
        data: {
          status: "approved",
        },
      });

      return updatedTimesheet;
    }),

  // Route to reject a timesheet (setting status back to blank/draft)
  rejectTimesheet: protectedProcedure
    .input(z.object({ timesheetId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Get the timesheet to verify it belongs to an employee of this manager
      const timesheet = await ctx.db.timesheet.findUnique({
        where: {
          id: input.timesheetId,
        },
        include: {
          user: true,
        },
      });

      if (!timesheet) {
        throw new Error("Timesheet not found");
      }

      // Verify the timesheet belongs to an employee of this manager
      if (timesheet.user.managerId !== ctx.session.user.id) {
        throw new Error("Unauthorized");
      }

      // Update the timesheet status (set to empty string or null to indicate it's back to draft)
      const updatedTimesheet = await ctx.db.timesheet.update({
        where: {
          id: input.timesheetId,
        },
        data: {
          status: "", // Empty string to indicate it's back to draft
        },
      });

      return updatedTimesheet;
    }),

  // Route to update employee status (activate, deactivate, or terminate)
  updateEmployeeStatus: protectedProcedure
    .input(
      z.object({
        employeeId: z.string(),
        status: z.enum(["active", "inactive", "terminated"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verify that the employee exists and is managed by the current user
      const employee = await ctx.db.user.findFirst({
        where: {
          id: input.employeeId,
          managerId: ctx.session.user.id,
        },
      });

      if (!employee) {
        throw new Error(
          "Employee not found or you don't have permission to manage this employee",
        );
      }

      // Update the employee's status
      const updatedEmployee = await ctx.db.user.update({
        where: {
          id: input.employeeId,
        },
        data: {
          status: input.status,
        },
      });

      return updatedEmployee;
    }),

  // WorkType Management
  getAllWorkTypes: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.isManager) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only managers can view work types",
      });
    }

    const workTypes = await ctx.db.workType.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return workTypes;
  }),

  getWorkTypeById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user.isManager) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only managers can view work types",
        });
      }

      const workType = await ctx.db.workType.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!workType) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Work type not found",
        });
      }

      return workType;
    }),

  createWorkType: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        color: z.string().min(1, "Color is required"),
        borderColor: z.string().min(1, "Border color is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.isManager) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only managers can create work types",
        });
      }

      const workType = await ctx.db.workType.create({
        data: {
          name: input.name,
          color: input.color,
          borderColor: input.borderColor,
        },
      });

      return workType;
    }),

  updateWorkType: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, "Name is required"),
        color: z.string().min(1, "Color is required"),
        borderColor: z.string().min(1, "Border color is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.isManager) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only managers can update work types",
        });
      }

      const workType = await ctx.db.workType.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          color: input.color,
          borderColor: input.borderColor,
        },
      });

      return workType;
    }),

  deleteWorkType: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.isManager) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only managers can delete work types",
        });
      }

      // Check if this work type is used in any entries
      const entriesUsingWorkType = await ctx.db.entry.findFirst({
        where: {
          workTypeId: input.id,
        },
      });

      if (entriesUsingWorkType) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot delete a work type that is in use",
        });
      }

      await ctx.db.workType.delete({
        where: {
          id: input.id,
        },
      });

      return { success: true };
    }),
});
