import { redirect } from "next/navigation";

import verifyToken from "@/actions/verifyToken";

type Props = {
  children: React.ReactNode;
};
/**
 * This function runs on server side
 * @param param0 children: React.ReactNode
 * @returns redirect to login page if token is invalid else return children
 */
const AuthCheck = async ({ children }: Props) => {
  const flg = await verifyToken();
  if (!flg) {
    return redirect("/login");
  }
  return <>{children}</>;
};

export default AuthCheck;
