"use client";

import { Organizer } from "@prisma/client";
import { Edit3, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

import EditOrganizerModal from "./EditOrganizerModal";
import useModal from "@/hooks/useModal";
import ConfirmModal from "@/components/ConfirmModal";
import trpc from "@/app/_trpc/client";
import toast from "react-hot-toast";

type Props = {
  organizer: Organizer;
  index: number;
};

const OrgTable = ({ organizer, index }: Props) => {
  const { openModal, closeModal } = useModal();
  const router = useRouter();
  const { mutate, isPending } = trpc.organizer.deleteOrganizer.useMutation();
  function handleDelete() {
    mutate(organizer.id, {
      onSuccess(data) {
        if (data) {
          toast.success("Organizer deleted successfully");
          router.refresh();
          closeModal();
        } else {
          toast.error("Something went wrong");
        }
      },
      onError(error) {
        toast.error(error.message);
      },
    });
  }
  return (
    <>
      <tr className="hover">
        <th>{index + 1}</th>
        <td>{organizer.o_name}</td>
        <td>{organizer.o_email}</td>
        <td>
          <span className="tooltip" data-tip={`Edit ${organizer.o_name}`}>
            <button
              className="btn btn-circle btn-info btn-outline btn-sm"
              onClick={() => openModal(`organizer-edit-${organizer.id}`)}
            >
              <Edit3 size={20} />
            </button>
          </span>
        </td>
        <td>
          <span className="tooltip" data-tip={`Delete ${organizer.o_name}`}>
            <button
              className="btn btn-circle btn-error btn-outline btn-sm"
              onClick={() => openModal(`confirm-${organizer.id}`)}
            >
              <Trash size={20} />
            </button>
          </span>
        </td>
      </tr>
      <EditOrganizerModal organizer={organizer} />
      <ConfirmModal
        message={`Are you sure you want to delete ${organizer.o_name}?`}
        id={organizer.id}
        confirm={handleDelete}
        disable={isPending}
      />
    </>
  );
};

export default OrgTable;
