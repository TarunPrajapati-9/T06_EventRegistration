import { OutFileRouter } from "@/app/api/uploadthing/core";
import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

export const UploadButton = generateUploadButton<OutFileRouter>();
export const UploadDropzone = generateUploadDropzone<OutFileRouter>();
