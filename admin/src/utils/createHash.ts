import { createHash as nodeCreateHash } from "node:crypto";

export default function createHash(str: string): string {
  let hash = nodeCreateHash("sha256").update(str).digest("hex");
  return hash;
}
