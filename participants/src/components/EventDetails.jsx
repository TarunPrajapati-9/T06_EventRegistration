import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getSingleEvent } from "../utils/dataGetter";
import Loader from "./Loader";
import toast from "react-hot-toast";
import { useEffect } from "react";

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const { mutate, data, isPending, isError } = useMutation({
    mutationFn: getSingleEvent,
  });
  useEffect(() => {
    mutate({ id: eventId });
  }, [eventId, mutate]);
  if (isError) {
    toast.error(`Kindly Login First!`);
    navigate("/signIn");
  }

  const handleRegisterClick = () => {
    navigate(`/registration/${eventId}`);
  };

  return (
    <div className="p-4">
      {isPending && <Loader />}
      {data && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <img
            src={data.canvas_image}
            alt={data.event_name}
            className="w-full h-96 pointer-events-none"
          />
          <div className="px-4 py-3 sm:px-0 flex flex-col items-center">
            <h1 className="text-3xl text-white">Event Details</h1>
            <p className="mt-1 max-w-2xl text-md leading-6 text-gray-500 text-center">
              Event details and rules.
            </p>
          </div>

          <div className="mt-2 border-t-2 border-gray-100 p-6">
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-slate-300">
                  Event Name
                </dt>
                <dd className="mt-1 text-sm text-white sm:col-span-2 sm:mt-0">
                  {data.event_name}
                </dd>
              </div>
              {/* <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-slate-300">
                  Organizer Name
                </dt>
                <dd className="mt-1 text-sm leading-6 text-white sm:col-span-2 sm:mt-0">
                  {data.organizer_id}
                </dd>
              </div> */}
              <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-slate-300">
                  Event Description
                </dt>
                <dd className="mt-1 text-sm leading-6 text-white sm:col-span-2 sm:mt-0">
                  {data.event_description}
                </dd>
              </div>
              <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-slate-300">
                  Date
                </dt>
                <dd className="mt-1 text-sm leading-6 text-white sm:col-span-2 sm:mt-0">
                  {data.event_date.split("T")[0]}
                </dd>
              </div>
              <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-slate-300">
                  Registration Fees
                </dt>
                <dd className="mt-1 text-sm leading-6 text-white sm:col-span-2 sm:mt-0">
                  {data.reg_fees}₹
                </dd>
              </div>
            </dl>
            <div className="flex justify-center">
              <button
                className="btn btn-success btn-outline my-4"
                onClick={() => handleRegisterClick(data._id)}
              >
                Click to Register
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
