import { observable, action } from 'mobx';

export default class UIStore {
  @observable resultModalOpen: boolean = false;

  @action
  toggleModal = () => {
    this.resultModalOpen = !this.resultModalOpen;
  };

}
