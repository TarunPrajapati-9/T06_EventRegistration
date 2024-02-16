import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

import verifyToken from "@/actions/verifyToken";

export default async function createContext({
  req,
  resHeaders,
}: FetchCreateContextFnOptions) {
  let adminFlag = await verifyToken();
  return {
    req,
    resHeaders,
    isAdmin: adminFlag,
  };
}
