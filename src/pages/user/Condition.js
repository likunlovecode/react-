import React, {Component} from 'react';
import {Input, Button, Radio, Row, Col, message} from 'antd';
import {mainStore} from "../../stores";
import {Http} from "../../helpers/Http";

const RadioGroup = Radio.Group;

class Condition extends Component {
  state = {
    purificationFacilities: 1,
    onlineMonitoring: '',
    onlineMonitoringDisabled: false,
    picArr: [],
    windSwitch: true,
    brands: '',
    waterSeparator: 1,
    greaseTrapSetting: '已设置',
    model: '',
    processingEfficiency: '',
    supportingFanAirVolume: '',
    result: 1,
  };

  urificationFacilitiesFn(ev) {
    if (ev.target.value === 0) {
      this.setState({
        windSwitch: false,
      });
    } else {
      this.setState({
        windSwitch: true
      });
    }
    this.setState({
      purificationFacilities: ev.target.value,
    });
  }

  purificationChange(ev) {
    this.setState({
      brands: ev.target.value,
    })
  }

  modelonChange(ev) {
    this.setState({
      model: ev.target.value,
    })
  }


  water(e) {
    this.setState({
      waterSeparator: e.target.value,
    });
  }

  setup(e) {
    this.setState({
      greaseTrapSetting: e.target.value,
    });
  }

  getBack() {
    this.props.history.push('/v1/user/company-list');
  }

  windChange(ev) {
    if(ev.target.value < 0){
      ev.target.value = ''
    }
    this.setState({
      supportingFanAirVolume: ev.target.value,
    })
  }


  // uploadPurification(ev) {
  //   let arr = this.state.picArr;
  //   arr.push({
  //     url: ev.downloadUrl,
  //     type: PICTYPE.TYPE.PURIFICATION
  //   });
  //   this.setState({
  //     picList: this.state.picList + 1,
  //     picArr: arr
  //   });
  // }

  submit() {
    let {purificationFacilities, brands, model, processingEfficiency, supportingFanAirVolume, waterSeparator, greaseTrapSetting, result} = this.state;
    let params = {
      purificationFacilities,
      brands:brands?brands:'',
      id: mainStore.id,
      model:model?model:'',
      processingEfficiency:processingEfficiency?processingEfficiency:'',
      supportingFanAirVolume,
      waterSeparator,
      greaseTrapSetting,
      result,
    };
    console.log(params);
      // Http.post(`/api/companyInfo/update-obj`, params, async (response) => {
      //   console.log(response)
      //   if (response.data.success) {
      //     const upload = async (obj) => {
      //       return new Promise((resolve) => {
      //         Http.post(`/api/v1/resource/create`, obj, (response) => {
      //           resolve(response);
      //         });
      //       });
      //     };
      //     const res = [];
      //     for (let i = 0; i < picArr.length; i++) {
      //       picArr[i].resourceId = mainStore.id;
      //       res.push(await upload(picArr[i]));
      //     }
      //     this.state.picList = 0;
      //     message.info('新增成功');
      //     this.props.history.push('/v1/user/company-list');
      //   }
      // });
      Http.post(`/api/companyInfo/update-obj`, params, async (response) => {
        if (response.data.success) {
          message.info('新增成功');
          this.props.history.push('/v1/user/company-list');
        }
      });
  }

  render() {
    let {windSwitch, purificationFacilities} = this.state;
    return (
      <div>
        <div style={{fontWeight: '700', fontSize: '18px', lineHeight: '40px', color: '#11bd42'}}>
          <span className="catalog" style={{color: '#11bd42'}}>企业目录</span> >
          <span className="infomation" style={{color: '#11bd42'}}>新增</span>
        </div>
        <div id="content">
          <br/>
          <Row>
            <Col span={4}><h4 style={{fontWeight: 700, color: '#1890ff'}}>净化设施建设和运行情况</h4></Col>
            <Col span={4} offset={14}>
              <Button type="danger" size={this.state.size} onClick={this.getBack.bind(this)}
                      style={{float: 'right'}}>返回</Button>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>净化设施</Col>
            <Col span={8}>
              <RadioGroup onChange={this.urificationFacilitiesFn.bind(this)} value={purificationFacilities}>
                <Radio value={1}>已安装</Radio>
                <Radio value={0}>未安装</Radio>
              </RadioGroup>
            </Col>
          </Row>
          <br/>
          {
            windSwitch ?
              <div>
                <Row>
                  <Col span={4}></Col>
                  <Col span={6}>
                    <label style={{marginRight: '40px'}}>品牌（选填）:</label>
                    <Input placeholder="请输入品牌" style={{width: 200}}
                           onChange={this.purificationChange.bind(this)}
                    />
                  </Col>
                </Row>
                <br/>
                <Row>
                  <Col span={6} offset={4}>
                    <label style={{marginRight: '40px'}}>型号（选填）:</label>
                    <Input placeholder="请输入型号" style={{width: 200}}
                           onChange={this.modelonChange.bind(this)}
                    />
                  </Col>
                </Row>
                <br/>
                <Row>
                  <Col span={8} offset={4}>
                    <label style={{marginRight: '10px'}}>配套风机风量（选填）:</label>
                    <Input placeholder="请输入" style={{width: 100}} type="number"
                           onChange={this.windChange.bind(this)}
                    />(m3/h)
                  </Col>
                </Row>
              </div>
              : ''
          }
          <br/>
          {/* <Row>
              <Col span={4}>净化设施照片</Col>
              <Col span={4}>
                <UploadQiniu
                    dom={
                      picList < 4 ?
                          <Button>
                            <Icon type="upload"/> 图片上传
                          </Button> : ''
                    }
                    callback={this.uploadPurification.bind(this)}
                />
              </Col>
            </Row> */}
          <Row>
            <Col span={4}>油水分离器</Col>
            <Col span={8}>
              <RadioGroup onChange={this.water.bind(this)} value={this.state.waterSeparator}>
                <Radio value={1}>已设置</Radio>
                <Radio value={0}>未设置</Radio>
              </RadioGroup>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>隔油池设置情况</Col>
            <Col span={8}>
              <RadioGroup onChange={this.setup.bind(this)} value={this.state.greaseTrapSetting}>
                <Radio value={'已设置'}>已设置</Radio>
                <Radio value={'未设置'}>未设置</Radio>
              </RadioGroup>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={8}></Col>
            <Col span={8}>
              <Button type="primary" size="large" className="btn" onClick={this.submit.bind(this)}>提交</Button>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}


export default Condition;
