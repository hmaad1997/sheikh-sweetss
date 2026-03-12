import { protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  isUserAuthorized,
  getAuthorizedUser,
  addAuthorizedUser,
  getAllAuthorizedUsers,
  getAccessLogs,
} from "./db";

export const accessControlRouter = router({
  checkAccess: protectedProcedure
    .query(async ({ ctx }) => {
      if (!ctx.user?.email) return false;
      return await isUserAuthorized(ctx.user.email);
    }),

  getAuthorizedUser: protectedProcedure
    .query(async ({ ctx }) => {
      if (!ctx.user?.email) return null;
      return await getAuthorizedUser(ctx.user.email);
    }),

  addAuthorizedUser: protectedProcedure
    .input(z.object({
      email: z.string().email(),
      name: z.string().min(1),
      role: z.enum(["owner", "manager", "employee"]),
    }))
    .mutation(async ({ input, ctx }) => {
      const user = await getAuthorizedUser(ctx.user?.email || "");
      if (!user || user.role !== "owner") {
        throw new Error("Only owner can add authorized users");
      }
      return await addAuthorizedUser(input);
    }),

  getAllAuthorizedUsers: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await getAuthorizedUser(ctx.user?.email || "");
      if (!user || user.role !== "owner") {
        throw new Error("Only owner can view authorized users");
      }
      return await getAllAuthorizedUsers();
    }),

  getAccessLogs: protectedProcedure
    .input(z.number().optional())
    .query(async ({ input, ctx }) => {
      const user = await getAuthorizedUser(ctx.user?.email || "");
      if (!user || user.role !== "owner") {
        throw new Error("Only owner can view access logs");
      }
      return await getAccessLogs(input || 100);
    }),
});
