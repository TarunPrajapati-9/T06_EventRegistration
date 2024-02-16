/* eslint-disable react/prop-types */
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useEffect } from "react";

import Modal from "./Modal";
import { getParticipants } from "../utils/dataGetter";
import Loader from "./Loader";

const ViewParticipant = ({ event }) => {
  const { mutate, isPending, error, data, isError } = useMutation({
    mutationFn: getParticipants,
  });
  useEffect(() => {
    mutate({ id: event._id });
  }, [event._id, mutate]);
  if (isError) toast.error(error.message);
  return (
    <Modal type={`view-participant-${event._id}`}>
      {isPending && <Loader />}
      {data?.length == 0 ? (
        <h1 className="text-center text-2xl font-bold my-6">
          No Participant Found
        </h1>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((participant, index) => (
                <tr key={participant[0]._id}>
                  <th>{index + 1}</th>
                  <td>{participant[0].p_name}</td>
                  <td>{participant[0].p_email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
};

export default ViewParticipant;
