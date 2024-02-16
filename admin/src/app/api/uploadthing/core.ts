import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

import verifyToken from "@/actions/verifyToken";

const f = createUploadthing();

export const outFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const flag = await verifyToken();

      if (!flag) throw new UploadThingError("unauthorized");

      return { message: "Valid user" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        message: "Uploaded",
        metadata,
        file,
      };
    }),
} satisfies FileRouter;

export type OutFileRouter = typeof outFileRouter;
