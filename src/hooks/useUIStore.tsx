import { useState } from "react";

export const useUIStore = () => {
  const [isResultModalOpen, setModalOpenStateState] = useState<boolean>(false)

  const toggleResultModal = (isOpen: boolean = false) => {
    setModalOpenStateState(isOpen)
  };

  return {
    isResultModalOpen,
    toggleResultModal
  }
}