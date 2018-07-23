import React from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import {observer} from 'mobx-react';

import {AuthSwitch} from './pages/AuthSwitch';
import Login from './pages/login/Login';
import TestRouter from './pages/test/TestRouter';
import {Forbidden} from './pages/Forbidden';
import {NotFound} from './pages/NotFound';

export const App = observer(() => (
  <Router>
    <Switch>
      <Route path="/login" component={Login}/>
      <Route path="/forbidden" component={Forbidden}/>
      <Route path="/v1" component={AuthSwitch}/>
      <Route path="/test" strict component={TestRouter}/>
      <Redirect from='/' to='/v1'/>
      <Route component={NotFound}/>
    </Switch>
  </Router>
));
