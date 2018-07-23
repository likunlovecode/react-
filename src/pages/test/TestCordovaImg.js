import React, {Component} from 'react';
import {Http} from '../../helpers/Http';
import {putb64} from '../../helpers/Media';
import {QINIU} from '../../constants/oauth-constants';
import CordovaPlugin from '../../helpers/CordovaPlugin';

class TestCordovaImg extends Component {
    state = {
        token: '',
        dataUri: '',
        url: ''
    };

    componentDidMount() {
        Http.get('/api/v1/resource/img-token', {}, (res) => {
            if (res.status === 200) {
                this.setState({
                    token: res.data.data,
                    url: 'porco',
                });
            }
            console.log(res);
        });
    }

    album() {
        CordovaPlugin.album((base64) => {
            this.setState({
                dataUri: base64
            });
        });
    }

    camera() {
        CordovaPlugin.camera((base64) => {
            this.setState({
                dataUri: base64
            });
        });
    }

    async upload() {
        const res = await putb64(this.state.dataUri, this.state.token, false);
        const url = `${QINIU.HUADONG.DOWNLOAD_URL}${res.key}`;
        this.setState({
            url: url
        });
    }

    render() {
        return (
            <div>
                <button onClick={this.album.bind(this)}>album</button>
                <button onClick={this.camera.bind(this)}>camera</button>
                <button onClick={this.upload.bind(this)}>upload</button>
                <img src={this.state.url} style={{width: '320px', height: '240px'}} />
                { this.state.url }
                {
                    this.state.dataUri ?
                        <img src={this.state.dataUri}/> : ''
                }
            </div>
        );
    }
}

export default TestCordovaImg;
