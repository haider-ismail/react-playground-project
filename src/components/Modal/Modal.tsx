import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

// contexts
import { UIStoreContext } from "../../contexts/uiStoreContext";

import './Modal.scss';

interface IProps {
}

const ModalFC: React.FunctionComponent<IProps> = ( { children }) => {
  const  { isResultModalOpen, toggleResultModal } = useContext(UIStoreContext);
  
  const closeModal = (e: React.MouseEvent<HTMLButtonElement> ) => {
    toggleResultModal(false)
  }

  // Using portal to render the modal in the document.body
  return ReactDOM.createPortal(
    <Modal
    appElement={document.getElementById('root') as HTMLElement}
    isOpen={ isResultModalOpen }
    className="modal p-10 max-w-full mx-10 w-full max-w-screen-xs sm:max-w-screen-sm md:max-w-screen-md mx-auto overflow-y-scroll rounded-md"
    shouldCloseOnEsc={true}
    shouldCloseOnOverlayClick={true}>
      <button className="absolute right-0 top-0 m-4" onClick={closeModal} arial-label="Close modal">
      <span className="bg-black rounded-full w-8 h-8 inline-block relative"><svg aria-hidden="true" className="pin-center" xmlns="http://www.w3.org/2000/svg" height="26px" viewBox="0 0 24 24" width="26px" fill="#fff"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></span></button>
      {children}
   </Modal>,
    document.body
  )
};

export default ModalFC;