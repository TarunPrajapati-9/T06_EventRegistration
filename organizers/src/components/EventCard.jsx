/* eslint-disable react/prop-types */
import { Edit2, Trash2, Users } from "lucide-react";

import EditEventModal from "./EditEventModal";
import useModal from "../../hooks/useModal";
import ViewParticipant from "./ViewParticipant";
import DeleteEvent from "./DeleteEvent";

const EventCard = ({ event, refetch }) => {
  const { openModal } = useModal();
  return (
    <>
      <div className="text-white">
        <div className="card card-compact w-96 bg-base-100 shadow-xl">
          <figure>
            <img
              src={event.canvas_image}
              alt={event.event_name ?? "Event Image"}
              className="w-full h-[300px] pointer-events-none object-cover rounded-lg"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">{event.event_name}</h2>
            <p className="text-sm opacity-70">
              {event.event_description.slice(0, 100)}...
            </p>
            <p className="flex items-center gap-2">
              Price:
              <span className="opacity-70">{event.reg_fees}</span>
            </p>
            <div className="card-actions justify-end">
              <button
                className="btn btn-circle border border-white flex outline-none items-center justify-center btn-ghost btn-outline btn-sm tooltip hover:rounded-lg"
                data-tip="View participants"
                onClick={() => openModal(`view-participant-${event._id}`)}
              >
                <Users size={20} color="white" />
              </button>
              <button
                className="btn btn-circle flex items-center justify-center outline-none btn-ghost btn-outline btn-sm tooltip hover:rounded-lg border border-white"
                data-tip="Edit"
                onClick={() => openModal(`event-edit-${event._id}`)}
              >
                <Edit2 size={20} color="white" />
              </button>
              <button
                className="btn btn-circle border border-white flex outline-none items-center justify-center btn-ghost btn-outline btn-sm tooltip hover:rounded-lg"
                data-tip="Delete"
                onClick={() => openModal(`delete-event-${event._id}`)}
              >
                <Trash2 size={20} color="white" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <EditEventModal refetch={refetch} event={event} />
      <ViewParticipant event={event} />
      <DeleteEvent event={event} refetch={refetch} />
    </>
  );
};

export default EventCard;
