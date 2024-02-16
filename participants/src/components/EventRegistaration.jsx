import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  eventRegistration,
  getParticipant,
  getSingleEvent,
} from "../utils/dataGetter";
import Loader from "./Loader";

const Registration = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const { mutate, data, isPending, isError, error } = useMutation({
    mutationFn: getSingleEvent,
  });
  useEffect(() => {
    mutate({ id: eventId });
  }, [eventId, mutate]);
  if (isError) toast.error(`Error in Fetching Event Details! ${error.message}`);

  const {
    data: participant,
    isLoading,
    isError: participant_isError,
    error: participant_error,
  } = useQuery({
    queryKey: ["participant"],
    queryFn: getParticipant,
  });

  if (participant_isError)
    toast.error(
      `Error in Fetching Participant Details! ${participant_error.message}`
    );

  const { mutate: registerMutation, isPending: isRegisterPending } =
    useMutation({
      mutationFn: eventRegistration,
      onSuccess: (data) => {
        if (data?.status) {
          toast.success("Registration Successful!");
          navigate("/");
        }
      },
      onError: () => {
        toast.error("Registration Failed! You Already Register for Event");
        navigate("/events");
      },
    });

  const handleRegistration = async () => {
    if (localStorage.getItem("participant_token")) {
      registerMutation({ id: eventId });
    } else {
      toast.error("Please Login First!");
      navigate("/SignIn");
    }
  };

  return (
    <div className="flex justify-center items-center flex-col mx-4 my-4 p-8">
      {isPending && <Loader />}
      {data && (
        <div className="flex flex-col">
          <h1 className="text-3xl">Event Name: {data.event_name}</h1>
          <h2 className="my-2 text-xl">
            Event Description: {data.event_description}
          </h2>
          <p className="my-2">Registration Fees: {data.reg_fees}₹</p>
        </div>
      )}
      {isLoading && <Loader />}
      {participant && (
        <div className="w-full my-5">
          <h1 className="text-2xl">Your Details</h1>
          <hr className="my-2" />
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Email</span>
            </div>
            <input
              type="text"
              name="p_email"
              value={participant.p_email}
              readOnly
              className="input input-bordered w-full disabled"
            />
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Name</span>
            </div>
            <input
              type="text"
              name="p_name"
              value={participant.p_name}
              readOnly
              className="input input-bordered w-full disabled"
            />
          </label>
          <p>{participant.email}</p>
          <button
            type="submit"
            className="btn btn-success mt-5 w-40"
            onClick={handleRegistration}
            disabled={isRegisterPending}
          >
            Confirm Register
          </button>
        </div>
      )}
    </div>
  );
};

export default Registration;
