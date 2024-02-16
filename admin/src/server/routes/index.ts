import { z } from "zod";
import * as jwt from "jsonwebtoken";
import { cookies } from "next/headers";

import { LoginSchema } from "@/utils/types/zod";
import createHash from "@/utils/createHash";
import db from "@/utils/db";

import { publicProcedure, router } from "../trpc";
import eventRouter from "./events";
import organizerRouter from "./organizer";

export const appRouter = router({
  login: publicProcedure
    .input(LoginSchema)
    .output(z.boolean())
    .mutation(async ({ input }) => {
      try {
        const { email, password } = input;
        const admin = await db.admin.findFirst({
          where: {
            a_email: email,
            a_password: createHash(password),
          },
        });
        if (admin) {
          const token = jwt.sign(
            {
              id: admin.id,
              email: admin.a_email,
            },
            process.env.JWT_SECRET!,
            {
              expiresIn: "1h",
            }
          );
          cookies().set(process.env.NEXT_PUBLIC_COOKIE_TOKEN_KEY, token, {
            httpOnly: true,
            sameSite: "strict",
            path: "/",
            secure: process.env.NODE_ENV === "production",
          });
          return true;
        } else {
          return false;
        }
      } catch (error: any) {
        console.error("Login error: ", error.message);
        return false;
      }
    }),
  events: eventRouter,
  organizer: organizerRouter,
});

export type AppRouter = typeof appRouter;
