import { observable } from 'mobx';

class MainStore {
  @observable authUser;
  @observable merchants;
  @observable enterpriseDetails;
  @observable menus;
}

export const mainStore = new MainStore();
