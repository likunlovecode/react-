import React, {Component} from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import TestRedux from './TestRedux';
import TestUploadQiniu from './TestUploadQiniu';
import TestMedia from './TestMedia';
import TestWebcam from './TestWebcam';
import TestCordovaCamera from './TestCordovaCamera';
import TestCordovaImg from './TestCordovaImg';

class TestRouter extends Component {
  render() {
    const prefix = this.props.match.path;
    return (
        <Switch>
          {/* 以下编写测试路由 */}
          <Route path={`${prefix}/redux`} exact component={TestRedux}/>
          <Route path={`${prefix}/upload/qiniu`} exact component={TestUploadQiniu}/>
          <Route path={`${prefix}/media`} exact component={TestMedia}/>
          <Route path={`${prefix}/webcam`} exact component={TestWebcam}/>
          <Route path={`${prefix}/cordova-camera`} exact component={TestCordovaCamera}/>
          <Route path={`${prefix}/cordova-album`} exact component={TestCordovaImg}/>
        </Switch>
    )
  }
}

export default TestRouter;
