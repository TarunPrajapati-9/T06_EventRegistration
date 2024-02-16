import { createRouteHandler } from "uploadthing/next";
import { outFileRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: outFileRouter,
  config: {
    uploadthingId: process.env.UPLOADTHING_APP_ID ?? "",
    uploadthingSecret: process.env.UPLOADTHING_SECRET ?? "",
  },
});
