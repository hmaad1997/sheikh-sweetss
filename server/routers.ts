import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { addTransaction, getTransactionsByDate, getTransactionsByMonth, getTransactionsByYear, getAllTransactions, getSettings } from "./db";
import { sendWhatsAppMessage, generateDailyReportMessage } from "./whatsapp";
import { accessControlRouter } from "./access-control-router";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  transactions: router({
    add: protectedProcedure
      .input(z.object({
        date: z.date(),
        description: z.string().min(1),
        type: z.enum(["revenue", "expense"]),
        paymentMethod: z.enum(["cash", "click", "visa", "bank"]),
        amount: z.string(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await addTransaction(input);
      }),

    getByDate: protectedProcedure
      .input(z.date())
      .query(async ({ input }) => {
        return await getTransactionsByDate(input);
      }),

    getByMonth: protectedProcedure
      .input(z.object({ year: z.number(), month: z.number() }))
      .query(async ({ input }) => {
        return await getTransactionsByMonth(input.year, input.month);
      }),

    getByYear: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await getTransactionsByYear(input);
      }),

    getAll: protectedProcedure
      .query(async () => {
        return await getAllTransactions();
      }),
  }),

  settings: router({
    get: protectedProcedure
      .query(async () => {
        return await getSettings();
      }),
  }),

  whatsapp: router({
    sendDailyReport: protectedProcedure
      .input(z.object({
        phoneNumber: z.string(),
        date: z.string(),
        totalRevenue: z.number(),
        totalExpense: z.number(),
        netDaily: z.number(),
      }))
      .mutation(async ({ input }) => {
        const message = generateDailyReportMessage(
          input.date,
          input.totalRevenue,
          input.totalExpense,
          input.netDaily
        );
        return await sendWhatsAppMessage(input.phoneNumber, message);
      }),
  }),

  accessControl: accessControlRouter,
});

export type AppRouter = typeof appRouter;
