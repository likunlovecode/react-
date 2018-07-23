import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { OAUTH } from '../constants/oauth-constants';
import { authStore, mainStore } from '../stores';
import { OAuthHelper } from '../helpers/OAuthHelper';
import AdminDashboard from './admin/AdminDashboard';
import UserDashboard from './user/UserDashboard';

import '../css/index.scss';

export class AuthSwitch extends React.Component {
  constructor(props) {
    super(props);
    this.prefix = this.props.match.path
  }
  async componentDidMount() {
    if (authStore.loggedIn) {
    } else {
      OAuthHelper.getAccessToken((res, token) => {
        mainStore.authUser.role === OAUTH.ADMIN_ROLE ?
          this.props.history.replace(`${this.prefix}/admin/company-list`) :
          this.props.history.replace(`${this.prefix}/user/company-list`);
      }, () => {
        this.props.history.replace('/login');
      })
    }
  }
  render() {
    return(
      <Switch>
        {
          authStore.loggedIn ?
            mainStore.authUser.role === OAUTH.ADMIN_ROLE ?
              <Route path={`${this.prefix}/admin`} strict component={AdminDashboard} /> :
              <Route path={`${this.prefix}/user`} strict component={UserDashboard} /> :
            <Redirect to="/login" />
        }
      </Switch>
    );
  }
}
