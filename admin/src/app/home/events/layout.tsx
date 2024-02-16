import SearchBox from "./components/SearchBox";

type Props = {
  children: React.ReactNode;
};
const LayoutEvent = ({ children }: Props) => {
  return (
    <>
      <div className="w-screen flex flex-col items-center justify-center">
        <div className="container">
          <h1 className="text-[40px] font-bold mt-[100px]">Upcoming Events</h1>
          <SearchBox />
          {children}
        </div>
      </div>
    </>
  );
};

export default LayoutEvent;
