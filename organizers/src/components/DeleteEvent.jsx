/* eslint-disable react/prop-types */
import { twMerge } from "tailwind-merge";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import Modal from "./Modal";
import useModal from "../../hooks/useModal";
import { deleteEvent } from "../utils/dataPoster";

const DeleteEvent = ({ event, refetch }) => {
  const { closeModal } = useModal();
  const { mutate, isPending } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: async () => {
      toast.success(`${event.event_name} deleted successfully`);
      await refetch();
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function confirmDelete() {
    mutate({ id: event._id });
  }
  return (
    <Modal type={`delete-event-${event._id}`} className="w-[600px]">
      <div className="p-4">
        <h1 className="text-2xl opacity-70">
          Are you sure that you want to delete
          <span className="font-bold"> {event?.event_name}</span>
        </h1>
        <div className="flex gap-4 mt-4 justify-end pr-2 pb-1">
          <button
            onClick={closeModal}
            className={twMerge(
              "btn btn-error btn-outline btn-ghost",
              "hover:text-white"
            )}
            disabled={isPending}
          >
            Cancel
          </button>
          <button
            className={twMerge(
              "btn btn-success btn-outline btn-ghost",
              "hover:text-white"
            )}
            onClick={confirmDelete}
            disabled={isPending}
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteEvent;
