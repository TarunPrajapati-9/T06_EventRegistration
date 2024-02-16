import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getEvents } from "../utils/dataGetter";
import Loader from "./Loader";

const Events = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["Events"],
    queryFn: getEvents,
  });

  if (isError) {
    toast.error(`Error in Fetching Events, Login First! ${error.message}`);
    navigate("/signIn");
  }
  const handleSeeMoreClick = (id) => {
    navigate(`${id}`);
  };
  return (
    <div>
      {isLoading && <Loader />}
      {data?.map(({ Events: event, Organizer: organizer }) => (
        <div
          key={event._id}
          className="card lg:card-side bg-base-100 shadow-xl mx-2 my-2"
        >
          <figure className="w-full md:w-[35%]">
            <img
              src={event.canvas_image}
              alt="Album"
              className="object-cover h-[350px] w-[500px] pointer-events-none"
            />
          </figure>
          <div className="card-body w-full md:w-[65%]">
            <div className="flex flex-col lg:flex-row lg:justify-between">
              <h1 className="card-title text-3xl text-white mb-4 lg:mb-0">
                {event.event_name}
              </h1>
              <div className="badge badge-neutral overflow-hidden">
                {organizer.o_name}
              </div>
            </div>
            <h2 className="text-xl">
              ₹{event.reg_fees} &#x2022; &nbsp;
              {event.event_date.split("T")[0]}
            </h2>
            <p>
              {event.event_description.split(" ").slice(0, 20).join(" ")}
              {event.event_description.split(" ").length > 20 ? "..." : ""}
            </p>

            <div className="card-actions justify-end">
              <button
                className="btn btn-primary"
                onClick={() => handleSeeMoreClick(event._id)}
              >
                See More
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Events;
