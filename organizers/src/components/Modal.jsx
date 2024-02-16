/* eslint-disable react/prop-types */
import { X } from "lucide-react";
import { useEffect } from "react";

import useModal from "../../hooks/useModal";

const Modal = ({ children, type: propModalType, className }) => {
  const { isOpen, closeModal: onClose, modalType } = useModal();
  const open = isOpen && modalType === propModalType;

  // handle escape key modal closing behavior
  useEffect(() => {
    function handleEscapeKey(e) {
      if (e.key === "Escape" || e.key === "Esc") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleEscapeKey);

    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onClose]);
  return (
    <div draggable={false}>
      <dialog id="my_modal_4" className={`modal ${open && "modal-open"}`}>
        <div
          className={`modal-box ${className} max-w-[1100px] overflow-hidden`}
        >
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-5 top-5"
              onClick={onClose}
            >
              <X />
            </button>
          </form>
          {/* modal body */}
          <div className="overflow-auto">{children}</div>
        </div>
      </dialog>
    </div>
  );
};

export default Modal;
