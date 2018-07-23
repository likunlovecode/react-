import { observable, action, computed } from 'mobx';

class LoadingSpinnerStore {
  @observable count = 0;
  @computed get show() {
    return this.count > 0;
  }
  @action inc() {
    this.count++;
  }
  @action dec() {
    this.count--;
    if (this.count < 0) {
      this.count = 0;
    }
  }
}

export const loadSpinnerStore = new LoadingSpinnerStore();
