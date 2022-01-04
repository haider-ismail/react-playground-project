import { useState, useEffect } from "react";
import _forEach from 'lodash/forEach';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';

export const useUIStore = () => {
  const [isResultModalOpen, setModalOpenStateState] = useState<boolean>(false)


  const toggleResultModal = (isOpen: boolean = false) => {
      console.log('[toggleModal --> isResultModalOpen !== isResultModalOpen', isResultModalOpen !== isResultModalOpen);
    
    setModalOpenStateState(isOpen)
  };


  useEffect(() => {
    console.log('%c useUItore [useEffect] -->','color: yellow;');

  }, []);

  return {
    isResultModalOpen,
    toggleResultModal
  }
}