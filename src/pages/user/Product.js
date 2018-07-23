import React, {Component} from 'react';
import {message, Input, Button, Row, Col, Checkbox, Select} from 'antd';
import {mainStore} from '../../stores';
import '../../css/details.scss';
import {Http} from "../../helpers/Http";

const Option = Select.Option;

class Product extends Component {
  state = {
    fuelswitch:false,
    addswitch:false,
    reswitch:false,
    businessHours: [],
    yearOperation: '',
    averageDailyPassengerFlow: '',
    averageMonthlyConsumptionOfEdibleOil: '',
    kitchenStove: '',
    gasStoves: '',
    inductionCooker: '',
    charcoalStove: '',
    alcoholStove: '',
    other: '',
    result: 0,
    fuelType: '',
    monthlyUsageFuel: '',
    monthlyAverageWaterConsumption: '',
    dailyCookingTime: '',
    businessArea: '',
    dayOperation: '',
  };

  handleChange(value) {
    if(value=='天然气'){
      this.setState({
        fuelType: value,
        fuelswitch:true,
        addswitch:false,
        reswitch:false
      })
    }
    if(value=='液化气'){
      this.setState({
        fuelType: value,
        addswitch:true,
        fuelswitch:false,
        reswitch:false
      })
    }
    if(value=='其他'){
      this.setState({
        fuelType: value,
        addswitch:false,
        fuelswitch:false,
        reswitch:true
      })
    }
  }

  handleBlur() {
    
  }

  handleFocus() {
   
  }

  timeChange(checkedValues) {
    this.setState({
      businessHours: checkedValues
    })
  }

  yearOperationFn(ev) {
    if(ev.target.value > 366){
      ev.target.value = 366
    }
    if(ev.target.value < 0){
      ev.target.value = ''
    }
    this.setState({
      yearOperation: ev.target.value
    })
  }

  dayOperationFn(ev) {
    if (ev.target.value > 24) {
      ev.target.value = 24
    }
    if (ev.target.value < 0) {
      ev.target.value = ''
    }
    this.setState({
      dayOperation: ev.target.value
    })
  }

  cookingTimeFn(ev) {
    if (ev.target.value > 24) {
      ev.target.value = 24
    }
    if (ev.target.value < 0) {
      ev.target.value = ''
    }
    this.setState({
      dailyCookingTime: ev.target.value
    })
  }

  averageFn(ev) {
    if(ev.target.value <0){
      ev.target.value = ''
    }
    this.setState({
      averageDailyPassengerFlow: ev.target.value
    })
  }

  measureAreaFn(ev) {
    if(ev.target.value < 0){
      ev.target.value = ''
    }
    this.setState({
      businessArea: ev.target.value
    })
  }

  averageMonthlyFn(ev) {
    if(ev.target.value < 0){
      ev.target.value = ''
    }
    this.setState({
      averageMonthlyConsumptionOfEdibleOil: ev.target.value
    })
  }

  waterMonthlyFn(ev) {
    if(ev.target.value < 0){
      ev.target.value = ''
    }
    this.setState({
      monthlyAverageWaterConsumption: ev.target.value
    })
  }

  kitchenStoveFn(ev) {
    if(ev.target.value < 0){
      ev.target.value = ''
    }
    this.setState({
      kitchenStove: ev.target.value
    })
  }

  fuelMonthlyFn(ev) {
    if(ev.target.value < 0){
      ev.target.value = ''
    }
    this.setState({
      monthlyUsageFuel: ev.target.value
    })
  }

  getBack() {
    this.props.history.push('/v1/user/company-list');
  }

  gasStovesFn(ev) {
    if(ev.target.value < 0){
      ev.target.value = ''
    }
    this.setState({
      gasStoves: ev.target.value
    })
  }

  inductionCookerFn(ev) {
    if(ev.target.value < 0){
      ev.target.value = ''
    }
    this.setState({
      inductionCooker: ev.target.value
    })
  }

  charcoalStoveFn(ev) {
    if(ev.target.value < 0){
      ev.target.value = ''
    }
    this.setState({
      charcoalStove: ev.target.value
    })
  }

  alcoholStoveFn(ev) {
    if(ev.target.value < 0){
      ev.target.value = ''
    }
    this.setState({
      alcoholStove: ev.target.value
    })
  }

  otherFn(ev) {
    if(ev.target.value < 0){
      ev.target.value = ''
    }
    this.setState({
      other: ev.target.value
    })
  }


  Condition() {
    let {businessHours, yearOperation, averageDailyPassengerFlow, averageMonthlyConsumptionOfEdibleOil, kitchenStove, gasStoves, inductionCooker, charcoalStove, alcoholStove, other, result, fuelType, monthlyUsageFuel, monthlyAverageWaterConsumption, dailyCookingTime, businessArea, dayOperation} = this.state;
    let params = {
      businessHours: businessHours.join(),
      yearOperation,
      averageDailyPassengerFlow,
      averageMonthlyConsumptionOfEdibleOil,
      kitchenStove,
      gasStoves,
      inductionCooker,
      charcoalStove,
      alcoholStove,
      other,
      result,
      id: mainStore.id,
      fuelType,
      monthlyUsageFuel,
      monthlyAverageWaterConsumption,
      dailyCookingTime,
      businessArea,
      dayOperation,

    };
    if (!businessHours || businessHours.length === 0) {
      message.info('请选择营业时段',4);
    } else if (!yearOperation) {
      message.info('请输入年运营时间',4);
    } else if (!dayOperation) {
      message.info('请输入日运营时间',4);
    } else if (!averageDailyPassengerFlow) {
      message.info('请输入平均日客流',4);
    } else if (!averageMonthlyConsumptionOfEdibleOil) {
      message.info('请输入食用油平均月使用量',4);
    } else if (!dailyCookingTime) {
      message.info('请输入日集中烹饪时间',4);
    } else if (!monthlyAverageWaterConsumption) {
      message.info('请输入月用水量',4);
    } else if (!businessArea) {
      message.info('请输入营业面积',4);
    } else if (!kitchenStove) {
      message.info('请输入厨房灶头',4);
    } else if (!fuelType) {
      message.info('请选择燃料类型',4);
    } else if (!monthlyUsageFuel) {
      message.info('请输入燃料月使用量',4);
    } else if (!gasStoves && !inductionCooker && !charcoalStove && !alcoholStove && !other) {
      message.info('就餐区域灶头至少输入一个',4);
    } else {
      Http.post(`/api/companyInfo/update-obj`, params, (response) => {
        if (response.data.success) {
          message.info('新增成功');
          this.props.history.push('/v1/user/condition');
        }
      });
    }
  }

  render() {
    let {fuelswitch,addswitch,reswitch} = this.state;
    return (
      <div>
        <div style={{fontWeight: '700', fontSize: '18px', lineHeight: '40px', color: '#11bd42'}}>
          <span className="catalog" style={{color:'#11bd42'}}>企业目录></span> >
          <span className="infomation" style={{color:'#11bd42'}}>新增</span>
        </div>
        <div id="content"><br/>
          <Row>
            <Col span={4}><h4 style={{fontWeight: 700,color:'#1890ff'}}>生产和投入</h4></Col>
            <Col span={4} offset={14}>
              <Button type="danger" size={this.state.size} onClick={this.getBack.bind(this)}
                      style={{float: 'right'}}>返回</Button>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>营业时段（多选）</Col>
            <Col span={8}>
              <Checkbox.Group style={{width: '100%'}} onChange={this.timeChange.bind(this)}>
                <Row>
                  <Col span={8}><Checkbox value="24小时">24小时</Checkbox></Col>
                  <Col span={8}><Checkbox value="早市">早市</Checkbox></Col>
                  <Col span={8}><Checkbox value="午市">午市</Checkbox></Col>
                  <Col span={8}><Checkbox value="晚市">晚市</Checkbox></Col>
                  <Col span={8}><Checkbox value="宵夜">宵夜</Checkbox></Col>
                </Row>
              </Checkbox.Group>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>日运营时间/小时</Col>
            <Col span={8}>
              <Input placeholder="请输入" type="number" onChange={this.dayOperationFn.bind(this)}/>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>日集中烹饪时间/小时</Col>
            <Col span={8}>
              <Input placeholder="请输入" type="number" onChange={this.cookingTimeFn.bind(this)}/>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>年运营时间/天</Col>
            <Col span={8}>
              <Input placeholder="请输入" type="number" onChange={this.yearOperationFn.bind(this)}/>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>平均日客流/人</Col>
            <Col span={8}>
              <Input placeholder="请输入" type="number" onChange={this.averageFn.bind(this)}/>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>营业面积/平方米</Col>
            <Col span={8}>
              <Input placeholder="请输入" type="number" onChange={this.measureAreaFn.bind(this)}/>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>食用油平均月使用量/kg</Col>
            <Col span={8}>
              <Input placeholder="请输入" type="number" onChange={this.averageMonthlyFn.bind(this)}/>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>月用水量/吨</Col>
            <Col span={8}>
              <Input placeholder="请输入" type="number" onChange={this.waterMonthlyFn.bind(this)}/>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>厨房灶头/个</Col>
            <Col span={8}>
              <Input placeholder="请输入" type="number" onChange={this.kitchenStoveFn.bind(this)}/>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>燃料类型</Col>
            <Col span={8}>
              <Select
                showSearch
                style={{width: 200}}
                placeholder="请选择燃料类型"
                optionFilterProp="children"
                onChange={this.handleChange.bind(this)}
                onFocus={this.handleFocus.bind(this)}
                onBlur={this.handleBlur.bind(this)}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                <Option value="天然气">天然气</Option>
                <Option value="液化气">液化气</Option>
                <Option value="其他">其他</Option>
              </Select>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>燃料月使用量/m³</Col>
            <Col span={8}>
              <Input placeholder="请输入" type="number" onChange={this.fuelMonthlyFn.bind(this)}/>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}><h4 style={{fontWeight: 700,color:'#1890ff'}}>就餐区域灶头/个</h4></Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>燃气灶</Col>
            <Col span={8}>
              <Input placeholder="请输入数量" style={{width: 200}} type="number" onChange={this.gasStovesFn.bind(this)}/>个
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>电磁炉</Col>
            <Col span={8}>
              <Input placeholder="请输入电磁炉数量" style={{width: 200}} type="number"
                     onChange={this.inductionCookerFn.bind(this)}/>个
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>炭火炉</Col>
            <Col span={8}>
              <Input placeholder="请输入炭火炉数量" style={{width: 200}} type="number"
                     onChange={this.charcoalStoveFn.bind(this)}/>个
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>酒精炉</Col>
            <Col span={8}>
              <Input placeholder="请输入酒精炉数量" style={{width: 200}} type="number"
                     onChange={this.alcoholStoveFn.bind(this)}/>个
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={4}>其他</Col>
            <Col span={8}>
              <Input placeholder="请输入其他数量" style={{width: 200}} type="number" onChange={this.otherFn.bind(this)}/>个
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={2} offset={10}>
              <Button type="primary" size="large" className="btn" onClick={this.Condition.bind(this)}>确认</Button>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}


export default Product;
