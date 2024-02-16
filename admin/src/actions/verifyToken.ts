import * as jwt from "jsonwebtoken";
import { cookies } from "next/headers";

/*
 * This function runs on server side used to verify the jwt from incoming cookies request
 * @param {string} token
 * @returns {Promise<string>}
 */
export default async function verifyToken(): Promise<boolean> {
  try {
    const token =
      cookies().get(process.env.NEXT_PUBLIC_COOKIE_TOKEN_KEY)?.value ?? "";
    if (token === "") {
      return false;
    }
    let flag = false;
    jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: any) => {
      if (err) flag = false;
      if (decoded) flag = true;
    });
    return flag;
  } catch (error: any) {
    console.log(`JWT verify error\n ${error}`);
    return false;
  }
}
