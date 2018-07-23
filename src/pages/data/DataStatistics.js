import React, {Component} from 'react';
import {Table, Row, Col} from 'antd';
import echarts from 'echarts';
import {ECHARS} from '../../constants/echars-constants';
import {Http} from "../../helpers/Http";


const columns1 = [
  {
    title: '菜系',
    dataIndex: 'name',
  },
  {
    title: '数量',
    dataIndex: 'nums',
  }
];

const columns2 = [
  {
    title: '餐厅规模',
    dataIndex: 'name',
  }, {
    title: '数量',
    dataIndex: 'nums',
  }
];

const columns3 = [
  {
    title: '隔油设施',
    dataIndex: 'grade',
  }, {
    title: '数量',
    dataIndex: 'nums',
  }
];


const columns4 = [
  {
    title: '环保手续统计',
    dataIndex: 'name',
  }, {
    title: '数量',
    dataIndex: 'nums',
  }
];

const columns5 = [
  {
    title: '企业周边情况',
    dataIndex: 'name',
  }, {
    title: '数量',
    dataIndex: 'nums',
  }
];

const columns6 = [
  {
    title: '油烟净化设施设置情况',
    dataIndex: 'name',
  }, {
    title: '数量',
    dataIndex: 'nums',
  }
];

class DataStatistics extends Component {
  state = {
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    itemStyle: {
      emphasis: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    },
    menus: [],
    businessSituation: [],
    environmentalProcedures: [],
    result: [],
    size: [],
    oilSeparationFacility:[],
    purificationFacilities:[],
  };

  componentDidMount() {
    Http.get(`/api/companyInfo/statistics`, {}, (response) => {
      if (response.data.success) {
        let index = 1;
        let data = response.data.data;

        for (let v of data.menus) {
          if (!v.nums) {
            v.nums = '暂无数据'
          }
          v.key = index++;
          v.value = v.nums;
        }

        for (let v of data.size) {
          if (!v.restaurantSeats) {
            v.restaurantSeats = '暂无数据'
          }
          v.key = index++;
          v.value = v.nums;
          v.name = v.type;
        }

        for (let v of data.environmentalProcedures) {
          if (!v.environmentalProcedures) {
            v.environmentalProcedures = '暂无数据'
          }
          v.key = index++;
          v.value = v.nums;
          v.name = v.environmentalProcedures;
        }

        for (let v of data.result) {
          if (!v.result) {
            v.result = '暂无数据'
          }
          v.key = index++;
          v.value = v.nums;
          v.name = v.result === 1 ? '已提交' : '未提交';
        }

        for (let v of data.businessSituation) {
          if (!v.businessSituation) {
            v.businessSituation = '暂无数据'
          }
          v.key = index++;
          v.value = v.nums;
          v.name = v.location;
        }

        for (let v of data.oilSeparationFacility) {
          if (!v.oilSeparationFacility) {
            v.oilSeparationFacility = '暂无数据'
          }
          v.key = index++;
          v.value = v.nums;
          v.name = v.grade;
        }

        for (let v of data.purificationFacilities) {
          if (!v.purificationFacilities) {
            v.purificationFacilities = '暂无数据'
          }
          v.key = index++;
          v.value = v.nums;
          v.name = v.purificationFacilities;
        }

        this.setState({
          menus: response.data.data.menus,
          businessSituation: response.data.data.businessSituation,
          environmentalProcedures: response.data.data.environmentalProcedures,
          result: response.data.data.result,
          size: response.data.data.size,
          oilSeparationFacility:response.data.data.oilSeparationFacility,
          purificationFacilities:response.data.data.purificationFacilities,
        });

        let menusOption = {
          title: {
            text: '餐企菜系分布',
            x: 'center'
          },
          tooltip: this.state.tooltip,
          legend: this.state.legend,
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: ['50%', '70%'],//饼状图的大小
              center: ['50%', '60%'],//用来控制图表在页面中的方位，第一个参数为左右，第二个参数为上下
              data: this.state.menus,
              // color:['yellow','blue','green'],
              itemStyle: this.state.itemStyle,
            }
          ],

        };

        menus.setOption(menusOption);

        let option2 = {
          title: {
            text: '餐厅规模分布',
            x: 'center'
          },
          tooltip: this.state.tooltip,
          legend: this.state.legend,
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: ['50%', '70%'],
              center: ['50%', '60%'],
              data: this.state.size,
              itemStyle: this.state.itemStyle,
            }
          ],
        };

        echarts2.setOption(option2);

        let option3 = {
          title: {
            text: '隔油设施设置情况统计',
            x: 'center'
          },
          tooltip: this.state.tooltip,
          legend: this.state.legend,
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: ['50%', '70%'],
              center: ['50%', '60%'],
              data: this.state.oilSeparationFacility,
              itemStyle: this.state.itemStyle,
            }
          ],
        };

        echarts3.setOption(option3);

        let option4 = {
          title: {
            text: '餐饮企业环保手续',
            x: 'center'
          },
          tooltip: this.state.tooltip,
          legend: this.state.legend,
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: ['50%', '70%'],
              center: ['50%', '60%'],
              data: this.state.environmentalProcedures,
              itemStyle: this.state.itemStyle,
            }
          ],
        };
        echarts4.setOption(option4);

        let option5 = {
          title: {
            text: '餐饮企业位置',
            x: 'center'
          },
          tooltip: this.state.tooltip,
          legend: this.state.legend,
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: ['50%', '70%'],
              center: ['50%', '60%'],
              data: this.state.businessSituation,
              itemStyle: this.state.itemStyle,
            }
          ],
        };
        echarts5.setOption(option5);
  
        let option6 = {
          title: {
            text: '油烟净化设施设置情况',
            x: 'center'
          },
          tooltip: this.state.tooltip,
          legend: this.state.legend,
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: ['50%', '70%'],
              center: ['50%', '60%'],
              data: this.state.purificationFacilities,
              itemStyle: this.state.itemStyle,
            }
          ],
        };
        echarts6.setOption(option6);
      }

      
    });

    let menus = echarts.init(document.querySelector('.menus'), ECHARS.THEME);

    let echarts2 = echarts.init(document.querySelector('.echarts2'), ECHARS.THEME);

    let echarts3 = echarts.init(document.querySelector('.echarts3'), ECHARS.THEME);

    let echarts4 = echarts.init(document.querySelector('.echarts4'), ECHARS.THEME);

    let echarts5 = echarts.init(document.querySelector('.echarts5'), ECHARS.THEME);

    let echarts6 = echarts.init(document.querySelector('.echarts6'), ECHARS.THEME);
  }

  render() {
    return (
      <div>
        <Row>
          <Col span={24} offset={1} style={{fontWeight: '700', fontSize: '18px', lineHeight: '40px'}}>数据统计</Col>
        </Row>
        <Row style={{marginTop: '60px'}}>
          <Col span={6}>
            <Table columns={columns1} dataSource={this.state.menus} bordered={true} pagination={false}/>
          </Col>
          <Col span={10} offset={4}>
            <div className="menus" style={{height: '400px'}}></div>
          </Col>
        </Row>
        <Row style={{marginTop: '60px'}}>
          <Col span={6}>
            <Table columns={columns2} dataSource={this.state.size} bordered={true} pagination={false}/>
          </Col>
          <Col span={10} offset={4}>
            <div className="echarts2" style={{height: '400px'}}></div>
          </Col>
        </Row>
        <Row style={{marginTop: '60px'}}>
          <Col span={6}>
            <Table columns={columns3} dataSource={this.state.oilSeparationFacility} bordered={true} pagination={false}/>
          </Col>
          <Col span={10} offset={4}>
            <div className="echarts3" style={{height: '400px'}}></div>
          </Col>
        </Row>
        <Row style={{marginTop: '60px'}} gutter={24}>
          <Col span={6}>
            <Table columns={columns4} dataSource={this.state.environmentalProcedures} bordered={true} pagination={false}/>
          </Col>
          <Col span={10} offset={4}>
            <div className="echarts4" style={{height: '400px'}}></div>
          </Col>
        </Row>
        <Row style={{marginTop: '60px'}}>
          <Col span={6}>
            <Table columns={columns5} dataSource={this.state.businessSituation} bordered={true} pagination={false}/>
          </Col>
          <Col span={10} offset={4}>
            <div className="echarts5" style={{height: '400px'}}></div>
          </Col>
        </Row>
        <Row style={{marginTop: '60px'}}>
          <Col span={6}>
            <Table columns={columns6} dataSource={this.state.purificationFacilities} bordered={true} pagination={false}/>
          </Col>
          <Col span={10} offset={4}>
            <div className="echarts6" style={{height: '400px'}}></div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default DataStatistics;
