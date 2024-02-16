"use client";

import useModal from "@/hooks/useModal";
import Modal from "./Modal";
import { twMerge } from "tailwind-merge";

type Props = {
  message: string;
  confirm: () => void;
  id: string;
  disable?: boolean;
};

const ConfirmModal = ({ confirm, message, id, disable }: Props) => {
  const { closeModal } = useModal();
  return (
    <Modal type={`confirm-${id}`} className="w-[400px]">
      <div>
        <h1 className="text-2xl font-bold">{message}</h1>
        <div className="flex gap-4 mt-4 justify-end pr-2 pb-1">
          <button
            onClick={closeModal}
            className={twMerge(
              "btn btn-error btn-outline btn-ghost",
              "hover:text-white"
            )}
            disabled={disable}
          >
            Cancel
          </button>
          <button
            onClick={confirm}
            className={twMerge(
              "btn btn-success btn-outline btn-ghost",
              "hover:text-white"
            )}
            disabled={disable}
          >
            {disable && <span className="loading loading-spinner" />}
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
