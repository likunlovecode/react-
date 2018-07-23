import React, {Component} from 'react';
import {Http} from '../../helpers/Http';
import {putb64} from '../../helpers/Media';
import {QINIU} from '../../constants/oauth-constants';
import CordovaPlugin from '../../helpers/CordovaPlugin';

class TestCordovaCamera extends Component {
    state = {
        token: '',
        dataUri: '',
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

    init() {
        CordovaPlugin.camera((base64) => {
            const image = document.getElementById('camera');
            image.src = base64;
            this.setState({
                dataUri: base64
            });
        });
    }

    async upload() {
        const res = await putb64(this.state.dataUri, this.state.token, false);
        const url = `${QINIU.HUADONG.DOWNLOAD_URL}${res.key}`;
        console.log(url);
        this.setState({
            url: url
        });
    }

    render() {
        return (
            <div>
                <button onClick={this.init.bind(this)}>start</button>
                <button onClick={this.upload.bind(this)}>upload</button>
                <div id='camera' style={{width: '320px', height: '240px'}}></div>
                { this.state.url }
                {
                    this.state.dataUri ?
                        <img src={this.state.dataUri}/> : ''
                }
            </div>
        );
    }
}

export default TestCordovaCamera;
