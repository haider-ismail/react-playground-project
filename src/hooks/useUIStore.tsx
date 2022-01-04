import { useState } from "react";
import _forEach from 'lodash/forEach';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';

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