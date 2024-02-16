import UtilHeader from "./components/UtilHeader";

type Props = {
  children: React.ReactNode;
};
const LayoutEvent = ({ children }: Props) => {
  return (
    <>
      <div className="w-screen flex flex-col items-center justify-center">
        <div className="container">
          <h1 className="text-[40px] font-bold mt-[100px]">Organizers</h1>
          <UtilHeader />
          {children}
        </div>
      </div>
    </>
  );
};

export default LayoutEvent;
