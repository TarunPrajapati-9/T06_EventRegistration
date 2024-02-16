/* eslint-disable @next/next/no-img-element */
"use client";

import { Edit2, Trash2 } from "lucide-react";
import { type Organizer } from "@prisma/client";
import { toast } from "react-hot-toast";

import useModal from "@/hooks/useModal";
import trpc from "@/app/_trpc/client";
import { ParsedEventType } from "@/utils/types";

import EditEventModal from "./EditEventModal";
import ConfirmModal from "./ConfirmModal";
import { useRouter } from "next/navigation";

type Props = {
  event: ParsedEventType;
  organizer: Organizer | null;
};

const EventCard = ({ event, organizer }: Props) => {
  const { openModal, closeModal } = useModal();
  const { mutate, isPending } = trpc.events.deleteEvent.useMutation();
  const router = useRouter();
  function handleDelete() {
    mutate(event.id, {
      onSuccess: () => {
        toast.success("Event deleted successfully");
        router.refresh();
        closeModal();
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  }
  return (
    <>
      <div className="card h-[200px] w-96 bg-base-100 shadow-xl image-full">
        <figure>
          <img
            src={event.canvas_image}
            alt={event.event_name}
            className="w-full h-[200px] object-contain"
          />
        </figure>
        <div className="card-body h-[200px]">
          <h2 className="card-title w-full">
            {event.event_name.length > 15
              ? event.event_name.slice(0, 13) + "..."
              : event.event_name}{" "}
            <span className="text-sm text-white opacity-70">
              {organizer?.o_name &&
                (`by ${organizer.o_name}`.length > 15
                  ? "by " + organizer?.o_name.slice(0, 13) + "..."
                  : "by " + organizer?.o_name)}{" "}
            </span>
          </h2>
          <p>
            {event.event_description.length > 65
              ? event.event_description.slice(0, 65) + "..."
              : event.event_description}
          </p>
          <div className="card-actions justify-between items-center">
            <div className="badge badge-outline p-3">
              {event.event_date}&nbsp;{" "}
              <span className="text-xs ml-3 text-white">₹{event.reg_fees}</span>
            </div>
            <div className="flex gap-2">
              <button
                className="btn btn-circle flex items-center justify-center outline-none btn-ghost btn-outline btn-sm tooltip hover:rounded-lg border border-white"
                data-tip="Edit"
                onClick={() => openModal(`event-edit-${event.id}`)}
              >
                <Edit2 size={20} color="white" />
              </button>
              <button
                className="btn btn-circle border border-white flex outline-none items-center justify-center btn-ghost btn-outline btn-sm tooltip hover:rounded-lg"
                data-tip="Delete"
                onClick={() => openModal(`confirm-${event.id}`)}
              >
                <Trash2 size={20} color="white" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <EditEventModal event={event} organizer={organizer} />
      {/* for event deletion */}
      <ConfirmModal
        message={`Are you sure you want to delete ${event.event_name}?`}
        confirm={handleDelete}
        id={event.id}
        disable={isPending}
      />
    </>
  );
};

export default EventCard;
