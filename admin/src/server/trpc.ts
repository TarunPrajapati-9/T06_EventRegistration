/**
 * This file is used to initialize the trpc instances which is created once
 */

import { TRPCError, initTRPC } from "@trpc/server";

import createContext from "./context";

const t = initTRPC
  .context<Awaited<ReturnType<typeof createContext>>>()
  .create();

export const router = t.router;
export const publicProcedure = t.procedure;

const isAdminMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.isAdmin) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You are not authorized to perform this action",
      cause: "Invalid Token",
    });
  }
  return next({ ctx });
});

export const adminProcedure = t.procedure.use(isAdminMiddleware);
