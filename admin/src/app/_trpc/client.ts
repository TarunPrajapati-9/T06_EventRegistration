/**
 * TRPC client setup
 */

import { createTRPCReact } from "@trpc/react-query";

import { type AppRouter } from "@/server/routes";

const trpc = createTRPCReact<AppRouter>();
export default trpc;
