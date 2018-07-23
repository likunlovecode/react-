import React, {Component} from 'react';
import {List, Row, Col, Button, Card} from 'antd';
import {mainStore} from "../../stores";
import '../../css/details.scss';

class Details extends Component {
  state = {
    enterpriseDetails: {},
    menu: '',
    purificationFileList: [],
    restaurantNameFileList: [],
    operatingStatus: '',
    waterSeparator: '',
    purificationFacilities: '',
    size: 'large'
  };

  componentDidMount() {
    let purificationFileList = [];
    let restaurantNameFileList = [];
    let enterpriseDetails = mainStore.enterpriseDetails;

    for (let v of enterpriseDetails.resources) {
      if (v && v.type === 1) {
        purificationFileList.push({
          uid: v.id,
          url: v.url,
          type: v.type
        })
      }

      if (v && v.type === 2) {
        restaurantNameFileList.push({
          uid: v.id,
          url: v.url,
          type: v.type
        });
      }
    }

    this.setState({
      menu: enterpriseDetails.menu ? enterpriseDetails.menu.name : '',
      purificationFileList,
      restaurantNameFileList
    });


    if (enterpriseDetails.operatingStatus === 1) {
      this.setState({
        operatingStatus: '运行'
      })
    } else if (enterpriseDetails.operatingStatus === 2) {
      this.setState({
        operatingStatus: '停业'
      })
    } else if (enterpriseDetails.operatingStatus === 3) {
      this.setState({
        operatingStatus: '关闭'
      })
    } else {
      this.setState({
        operatingStatus: ''
      })
    }
    if (enterpriseDetails.purificationFacilities === 1) {
      this.setState({
        purificationFacilities: '已安装'
      })
    } else if (enterpriseDetails.purificationFacilities === 0) {
      this.setState({
        purificationFacilities: '未安装'
      })
    } else {
      this.setState({
        purificationFacilities: ''
      })
    }
    if (enterpriseDetails.waterSeparator === 1) {
      this.setState({
        waterSeparator: '已设置'
      })
    } else if (enterpriseDetails.waterSeparator === 0) {
      this.setState({
        waterSeparator: '未设置'
      })
    } else {
      this.setState({
        waterSeparator: ''
      })
    }
  }

  getBack() {
    mainStore.enterpriseDetails = null;
    this.props.history.goBack();
  }

  render() {
    let enterpriseDetails = mainStore.enterpriseDetails;
    const data1 = [
      {
        title: '企业名称',
        content: enterpriseDetails.companyName
      },
      {
        title: '法人代表',
        content: enterpriseDetails.legalRepresentative
      },
      {
        title: '餐厅名称',
        content: enterpriseDetails.restaurantName
      },
      {
        title: '社会信用代码',
        content: enterpriseDetails.socialCreditCode ? enterpriseDetails.socialCreditCode : null
      },
      {
        title: '普查小区代码',
        content: enterpriseDetails.censusCellCode
      },
      {
        title: '组织机构代码',
        content: enterpriseDetails.organizationCode ? enterpriseDetails.organizationCode : null
      },
      {
        title: '注册地址',
        content: enterpriseDetails.fullAddress
      },
      {
        title: '餐厅地址',
        content: enterpriseDetails.fullRestaurantAddress || enterpriseDetails.fullAddress
      },
      {
        title: '街坊号',
        content: enterpriseDetails.neighborhoodNumber
      },
      {
        title: '所在位置',
        content: enterpriseDetails.location
      },
      // {
      //   title: '法人代表',
      //   content: mainStore.enterpriseDetails.legalRepresentative
      // },
      {
        title: '联系人姓名',
        content: enterpriseDetails.contactName
      },
      {
        title: '联系电话',
        content: enterpriseDetails.contactPhone
      },
      {
        title: '餐饮类型',
        content: this.state.menu
      },
      {
        title: '环保手续',
        content: enterpriseDetails.environmentalProcedures
      },
      {
        title: '餐厅座位数',
        content: enterpriseDetails.restaurantSeats

      },
      {
        title: '运行状态',
        content: enterpriseDetails.operatingStatus
      },
      {
        title: '餐厅外部照片',
        content: ''
      }
    ];

    const data2 = [
        {
          title: '营业时段',
          content: enterpriseDetails.businessHours
        },
        {
          title: '日运营时间/小时',
          content: enterpriseDetails.dayOperation
        },
        {
          title: '年运营时间/天',
          content: enterpriseDetails.yearOperation
        },
        {
          title: '日集中烹饪时间/小时',
          content: enterpriseDetails.dailyCookingTime
        },
        {
          title: '平均日客流/人',
          content: enterpriseDetails.averageDailyPassengerFlow
        },
        {
          title: '营业面积/平方米',
          content: enterpriseDetails.businessArea
        },
        {
          title: '食用油平均月使用量/kg',
          content: enterpriseDetails.averageMonthlyConsumptionOfEdibleOil
        },
        {
          title: '月用水量/吨',
          content: enterpriseDetails.monthlyAverageWaterConsumption
        },
        {
          title: '厨房灶头/个',
          content: enterpriseDetails.kitchenStove
        },
        {
          title: '燃料类型',
          content: enterpriseDetails.fuelType
        },
        {
          // title: enterpriseDetails.fuelType == '其他' ? '燃料月使用量' : (enterpriseDetails.fuelType == '天然气' ? '燃料月使用量/m³' : '燃料月使用量/吨'),
          title: '燃料月使用量/m³',
          content: enterpriseDetails.monthlyUsageFuel
        },
      ]
    ;

    const data3 = [
      {
        title: '燃气灶',
        content: mainStore.enterpriseDetails.gasStoves
      },
      {
        title: '电磁炉',
        content: mainStore.enterpriseDetails.inductionCooker
      },
      {
        title: '炭火炉',
        content: mainStore.enterpriseDetails.charcoalStove
      },
      {
        title: '酒精炉',
        content: mainStore.enterpriseDetails.alcoholStove
      },
      {
        title: '其他',
        content: mainStore.enterpriseDetails.other
      }
    ];

    const data4 = [
      {
        title: '净化设施',
        content: this.state.purificationFacilities
      },
      {
        title: '品牌',
        content: mainStore.enterpriseDetails.brands || ''
      },
      {
        title: '型号',
        content: mainStore.enterpriseDetails.model
      },
      {
        title: '配套风机的风量',
        content: mainStore.enterpriseDetails.supportingFanAirVolume
      },
      {
        title: '油水分离器',
        content: this.state.waterSeparator ? this.state.waterSeparator : ''
      },
      {
        title: '隔油池设置情况',
        content: mainStore.enterpriseDetails.greaseTrapSetting
      },
    ];

    let {purificationFileList, restaurantNameFileList} = this.state;
    return (
      <div>
        <div style={{fontWeight: '700', fontSize: '18px', lineHeight: '40px', color: '#11bd42'}}>
          <span className="catalog" onClick={this.getBack.bind(this)} style={{color: '#11bd42'}}>企业目录</span>><span
          className="infomation" style={{color: '#11bd42'}}>企业基本信息</span>
        </div>
        <div id="content">
          <Row>
            <Col span={4}>
              <h4 style={{fontWeight: 700, color: '#1890ff', fontSize: '18px', lineHeight: '40px'}}>企业基本信息</h4>
            </Col>
            <Col span={4} offset={14}>
              <Button type="danger" size={this.state.size} onClick={this.getBack.bind(this)}
                      style={{float: 'right'}}>返回</Button>
            </Col>
          </Row>
          <List
            itemLayout="horizontal"
            dataSource={data1}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={<Row><Col span={8}>{item.title}</Col><Col span={16}>{item.content}</Col></Row>}
                />
              </List.Item>
            )}
          />
          <Row style={{overflow: 'hidden'}}>
            {
              purificationFileList.map((item, index) => {
                return (
                  <Col span={3} key={index}>
                    <Card
                      hoverable
                      style={{width: 100, height: 100}}
                      cover={<img alt="example" src={item.url}/>}
                    />
                  </Col>
                )
              })
            }
          </Row>
          < h3 style={{marginBottom: 16, marginTop: 16, color: '#1890ff'}}>生产和投入</h3>
          <List
            itemLayout="horizontal"
            dataSource={data2}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={<Row><Col span={8}>{item.title}</Col><Col span={16}>{item.content}</Col></Row>}
                />
              </List.Item>
            )}

          />
          <h3 style={{marginBottom: 16, marginTop: 16, color: '#1890ff'}}>就餐区域灶头/个</h3>
          <List
            itemLayout="horizontal"
            dataSource={data3}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={<Row><Col span={8}>{item.title}</Col><Col span={16}>{item.content}</Col></Row>}
                />
              </List.Item>
            )}

          />
          <h3 style={{marginBottom: 16, marginTop: 16, color: '#1890ff'}}>净化设施建设和运营情况</h3>
          <List
            itemLayout="horizontal"
            dataSource={data4}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={<Row><Col span={8}>{item.title}</Col><Col span={16}>{item.content}</Col></Row>}
                />
              </List.Item>
            )}

          />
          <Row style={{overflow: 'hidden'}}>
            {
              restaurantNameFileList.map((item, index) => {
                return (
                  <Col span={3} key={index}>
                    <Card
                      hoverable
                      style={{width: 100, height: 100}}
                      cover={<img alt="example" src={item.url}/>}
                    />
                  </Col>
                )
              })
            }
          </Row>
          <Row>
            <Col span={4} offset={8}>
              <Button type="primary" size={this.state.size} onClick={this.getBack.bind(this)}
                      style={{float: 'right'}}>返回</Button>
            </Col>
          </Row>

        </div>
      </div>
    )
  }
}


export default Details;
