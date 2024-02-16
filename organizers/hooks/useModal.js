import { create } from "zustand";

const useModal = create((set) => ({
  modalType: null,
  isOpen: false,
  openModal: (type) => set(() => ({ isOpen: true, modalType: type })),
  closeModal: () => set(() => ({ isOpen: false, modalType: null })),
}));

export default useModal;
