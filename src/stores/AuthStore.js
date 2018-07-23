import {observable, action} from 'mobx';

class AuthStore {
    @observable accessToken;
    @observable loggedIn;

    @action setLogStatus(b) {
        if (b !== this.loggedIn) {
            this.loggedIn = b;
        }
    }
}

export const authStore = new AuthStore();
