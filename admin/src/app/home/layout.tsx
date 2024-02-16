import AuthCheck from "@/components/AuthCheck";
import Navbar from "@/components/Navbar";

type Props = {
  children: React.ReactNode;
};

const HomeLayout = ({ children }: Props) => {
  return (
    <AuthCheck>
      <Navbar />
      {children}
    </AuthCheck>
  );
};

export default HomeLayout;
