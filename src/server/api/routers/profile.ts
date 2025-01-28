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
}); 