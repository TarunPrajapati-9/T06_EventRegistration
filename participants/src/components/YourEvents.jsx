import { useQuery } from "@tanstack/react-query";
import { getRegisteredEvents } from "../utils/dataGetter";
import toast from "react-hot-toast";
import Loader from "./Loader";

const YourEvents = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["reg_events"],
    queryFn: getRegisteredEvents,
  });

  if (isError) {
    toast.error(`Error in Fetching Events, ${error.message}`);
  }

  return (
    <div className="p-4">
      {isLoading && <Loader />}
      {data?.map((event, index) => (
        <div
          className="h-auto w-auto bg-base-300 rounded-md shadow-md mt-2 p-6 hover:bg-opacity-75"
          key={index}
        >
          <div>
            <b>Event Name : </b> {event.event_name}
          </div>
          <div>
            <b>Event Description : </b> {event.event_description}
          </div>
          <div>
            <b>Event Date : </b> {event.event_date.split("T")[0]}
          </div>
          <div>
            <b>Event Fees : </b> {event.reg_fees}
          </div>
        </div>
      ))}
    </div>
  );
};

export default YourEvents;
