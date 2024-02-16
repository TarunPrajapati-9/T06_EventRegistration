import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { getEvents } from "../utils/dataGetter";
import Loader from "../components/Loader";
import EventCard from "../components/EventCard";

const HomePage = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });
  const navigate = useNavigate();
  if (isError) {
    toast.error("Please login to continue");
    navigate("/signin");
  }
  return (
    <>
      <div className="w-full flex justify-center mt-10">
        <div className="container">
          <h1 className="text-white text-4xl font-bold my-10">Hosted Events</h1>
          {isLoading ? (
            <Loader />
          ) : (
            <div className="flex gap-6 justify-stretch flex-wrap">
              {data?.map((event) => (
                <EventCard refetch={refetch} event={event} key={event._id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
