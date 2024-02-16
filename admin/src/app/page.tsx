import verifyToken from "@/actions/verifyToken";
import { redirect } from "next/navigation";

export default async function Home() {
  const verifyFlag = await verifyToken();
  if (!verifyFlag) {
    return redirect("/login");
  }
  return redirect("/home");
}
