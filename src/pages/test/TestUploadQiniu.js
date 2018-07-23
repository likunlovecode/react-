import React, {Component} from "react";
import {Button, Icon} from 'antd';
import UploadQiniu from '../../helpers/UploadQiniu';

class UploadQiniuTest extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  uploadCallback(event) {
    console.log(event);
    // TODO(Porco) 此处上传成功回调，需要调用后端接口保存资源地址
  }

  render() {
    return (
      <div>
        <UploadQiniu
          dom={
            <Button>
              <Icon type="upload" /> upload
            </Button>
          }
          callback={this.uploadCallback.bind(this)}
        />
      </div>
    );
  };
}

export default UploadQiniuTest;
