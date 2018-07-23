import React from 'react';
import {Upload} from 'antd';
import {QINIU} from '../constants/oauth-constants';
import {Http} from './Http';

class UploadQiniu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: this.props.fileList || [],
      token: ''
    };
  }

  async componentDidMount() {
    await this.getQiniuToken();
  }

  getQiniuToken() {
    Http.get('/api/v1/resource/img-token', {}, (res) => {
      if (res.status === 200) {
        this.setState({
          token: res.data.data
        });
      }
    });
  }

  onChange(info) {
    this.setState({fileList: info.fileList});
    if (info.file.status === 'done') {
      info.downloadUrl = `${QINIU.HUADONG.DOWNLOAD_URL}${info.file.response.key}`;
      this.props.callback(info);
    }
  }

  onRemove(info) {
    //this.setState({fileList: info.fileList});
    this.props.remove(info);
  }

  render() {
    const listUploadProps = {
      action: QINIU.HUADONG.ACTION,
      name: 'file',
      listType: 'picture',
      fileList: this.state.fileList,
      data: {
        token: this.state.token
      },
      className: 'ant-upload-text',
      onChange: (info) => this.onChange(info),
      onRemove: (info) => this.onRemove(info) || '',
    };
    return (
      <Upload
        {...listUploadProps}
      >
        {this.props.dom}
      </Upload>
    );
  }
}

export default UploadQiniu;
