import { create } from "zustand";

interface ConfirmModal {
  isTrue: boolean;
  setIsTTrue: (flg: boolean) => void;
}

const useConfirmModal = create<ConfirmModal>((set) => ({
  isTrue: false,
  setIsTTrue: (flg: boolean) => set(() => ({ isTrue: flg })),
}));

export default useConfirmModal;
