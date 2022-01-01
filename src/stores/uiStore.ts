import { observable, action } from 'mobx';

export class UIStore {
  @observable resultModalOpen: boolean = false;

  @action
  toggleModal = () => {
    this.resultModalOpen = !this.resultModalOpen;
  };

}
