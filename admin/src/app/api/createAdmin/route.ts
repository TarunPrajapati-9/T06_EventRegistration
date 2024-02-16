import createHash from "@/utils/createHash";
import db from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  //   await db.admin.create({
  //     data: {
  //       a_email: "admin@gmail.com",
  //       a_name: "admin",
  //       a_password: createHash("12345678"),
  //     },
  //   });

  return NextResponse.json({ message: "success" });
}
