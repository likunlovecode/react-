import React, { Component } from 'react';
import Media from '../../helpers/Media';
import { Http } from '../../helpers/Http';

let media;
class TestMedia extends Component {
  state = {
    token: '',
  };
  componentDidMount() {
    Http.get('/api/v1/resource/img-token', {}, (res) => {
      if (res.status === 200) {
        this.setState({
          token: res.data.data
        });
      }
      console.log(res);
    });
  }

  start() {
    media = new Media(0);
    media.start((status) => {
      console.log('stop:', status);
    });
  }
  stop() {
    media.stop();
  }
  upload() {
    media.upload(this.state.token, false, (res) => {
      console.log(res);
    });
  }

  render() {
    return(
      <div>
        <button onClick={this.start.bind(this)} >start</button>
        <button onClick={this.stop.bind(this)} >stop</button>
        <button onClick={this.upload.bind(this)} >upload</button>
      </div>
    );
  }
}

export default TestMedia;
