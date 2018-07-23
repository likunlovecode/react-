import React, {Component} from 'react';
import {Table, Row, Col,Select,Button} from 'antd';
import echarts from 'echarts';
import {ECHARS} from '../../constants/echars-constants';
import {Http} from "../../helpers/Http";

const Option = Select.Option;


class Graph extends Component {
  state = {
    contaminants:{},
    pollutant:{},
    waste:{},
    effluent:{},
    streetList:[],
    waterList:[],
    areaId:'',
  };

  streetSelect(value){
    this.setState({
        areaId:value
    })
    
  }

  waterSelect(value){
    this.setState({
        areaId:value
    })
    
  }

  Product(){
    let {areaId} = this.state;
    let params = {
        areaId
    }
    Http.get(`/api/companyInfo/atmosphericPollutant-areaId`,params, (response) => {
        if(response.data.success){
            this.setState({
                pollutant:response.data.data
            })
            let option2 = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: ['大气污染物年排放量(mg/a)']
                },
                title: {
                    text: '',
                    subtext: ''
                },
                
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category',
                    data: ['VOCs','PM2.5','PM10',],
                    
                },
                series: [
                    {
                        name: '大气污染物年排放量(mg/a)',
                        type: 'bar',
                        data: [this.state.pollutant['vocs'], this.state.pollutant['PM2.5'], this.state.pollutant['PM10']]
                    },
                ]
            };
            let echarts2 = echarts.init(document.querySelector('.echarts2'), ECHARS.THEME);
            echarts2.setOption(option2);
        }
        
    });
  }

  water(){
    let {areaId} = this.state;
    let params = {
        areaId
    }
    Http.get(`/api/companyInfo/wastewaterPollutant-areaId`,params, (response) => {
        if(response.data.success){
            this.setState({
                effluent:response.data.data
            })
            let option4 = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: ['废水污染物总排放量(mg/a)']
                },
                title: {
                    text: '',
                    subtext: ''
                },
                
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category',
                    data: ['BOD5','COD','动植物油',],
                    
                },
                series: [
                    {
                        name: '废水污染物总排放量(mg/a)',
                        type: 'bar',
                        data: [this.state.effluent['BOD5'], this.state.effluent['COD'], this.state.effluent['动植物油']]
                    },
                ]
            };
            let echarts4 = echarts.init(document.querySelector('.echarts4'), ECHARS.THEME);
            echarts4.setOption(option4);
        }
        
    });

  }

    componentWillMount(){
        Http.get(`/api/address/find-pid?parentCodeId=${310110000000}`, {}, (response) => {
            this.setState({
            streetList: response.data.data
            })
        });
        Http.get(`/api/address/find-pid?parentCodeId=${310110000000}`, {}, (response) => {
            this.setState({
            waterList: response.data.data
            })
        });
    }

  componentDidMount() {
    Http.get(`/api/companyInfo/atmosphericPollutant`, {}, (response) => {
        if(response.data.success){
            this.setState({
                contaminants:response.data.data
            })
            let option1 = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: ['大气污染物年排放量(mg/a)']
                },
                title: {
                    text: '',
                    subtext: ''
                },
                
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category',
                    data: ['VOCs','PM2.5','PM10',],
                    
                },
                series: [
                    {
                        name: '大气污染物年排放量(mg/a)',
                        type: 'bar',
                        data: [this.state.contaminants['vocs'], this.state.contaminants['PM2.5'], this.state.contaminants['PM10']]
                    },
                ]
            };
            let echarts1 = echarts.init(document.querySelector('.echarts1'), ECHARS.THEME);
            echarts1.setOption(option1);
        }
    });

    Http.get(`/api/companyInfo/wastewaterPollutant`, {}, (response) => {
        if(response.data.success){
            this.setState({
                waste:response.data.data
            })
            let option3 = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: ['废水污染物总排放量(mg/a)']
                },
                title: {
                    text: '',
                    subtext: ''
                },
                
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category',
                    data: ['BOD5','COD','动植物油'],
                    
                },
                series: [
                    {
                        name: '废水污染物总排放量(mg/a)',
                        type: 'bar',
                        data: [this.state.waste['BOD5'], this.state.waste['COD'], this.state.waste['动植物油']]
                    },
                ]
            };
            let echarts3 = echarts.init(document.querySelector('.echarts3'), ECHARS.THEME);
            echarts3.setOption(option3);
        }
    });

    // let option2 = {
    //     tooltip: {
    //         trigger: 'axis',
    //         axisPointer: {
    //             type: 'shadow'
    //         }
    //     },
    //     legend: {
    //         data: ['大气污染物年排放量(mg/a)']
    //     },
    //     title: {
    //         text: '',
    //         subtext: ''
    //     },
        
    //     grid: {
    //         left: '3%',
    //         right: '4%',
    //         bottom: '3%',
    //         containLabel: true
    //     },
    //     xAxis: {
    //         type: 'value',
    //         boundaryGap: [0, 0.01]
    //     },
    //     yAxis: {
    //         type: 'category',
    //         data: ['VOCs','PM2.5','PM10',],
            
    //     },
    //     series: [
    //         {
    //             name: '大气污染物年排放量(mg/a)',
    //             type: 'bar',
    //             data: [100, 200, 150]
    //         },
    //     ]
    // };
    // let echarts2 = echarts.init(document.querySelector('.echarts2'), ECHARS.THEME);
    // echarts2.setOption(option2);

    // let option4 = {
    //     tooltip: {
    //         trigger: 'axis',
    //         axisPointer: {
    //             type: 'shadow'
    //         }
    //     },
    //     legend: {
    //         data: ['废水污染物总排放量(mg/a)']
    //     },
    //     title: {
    //         text: '',
    //         subtext: ''
    //     },
        
    //     grid: {
    //         left: '3%',
    //         right: '4%',
    //         bottom: '3%',
    //         containLabel: true
    //     },
    //     xAxis: {
    //         type: 'value',
    //         boundaryGap: [0, 0.01]
    //     },
    //     yAxis: {
    //         type: 'category',
    //         data: ['BOD5','COD','动植物油',],
            
    //     },
    //     series: [
    //         {
    //             name: '废水污染物总排放量(mg/a)',
    //             type: 'bar',
    //             data: [100, 200, 150]
    //         },
    //     ]
    // };
    // let echarts4 = echarts.init(document.querySelector('.echarts4'), ECHARS.THEME);
    // echarts4.setOption(option4);
    
  }

  render() {

    const columns1 = [{
        title: '类型',
        dataIndex: 'name',
        render: text => <a href="javascript:;">{text}</a>,
      }, {
        title: 'PM10',
        className: 'column-money',
        dataIndex: 'money',
      }, 
        {
        title: 'PM2.5',
        className: 'column',
        dataIndex: 'box',
        }, {
        title: 'VOCs',
        dataIndex: 'address',
      }];
      
      const data1 = [{
        key: '1',
        name: '排放量(mg/a)',
        money:this.state.contaminants['PM10'],
        box:this.state.contaminants['PM2.5'],
        address: this.state.contaminants['vocs'],
      }, ];

      const columns2 = [{
        title: '类型',
        dataIndex: 'name',
        render: text => <a href="javascript:;">{text}</a>,
      }, {
        title: 'PM10',
        className: 'column-money',
        dataIndex: 'money',
      }, 
        {
        title: 'PM2.5',
        className: 'column',
        dataIndex: 'box',
        }, {
        title: 'VOCs',
        dataIndex: 'address',
      }];
      
      const data2 = [{
        key: '2',
        name: '排放量(mg/a)',
        money:this.state.pollutant['PM10']?this.state.pollutant['PM10']:'',
        box:this.state.pollutant['PM2.5']?this.state.pollutant['PM2.5']:'',
        address: this.state.pollutant['vocs']?this.state.pollutant['vocs']:'',
      }, ];

      const columns3 = [{
        title: '类型',
        dataIndex: 'name',
        render: text => <a href="javascript:;">{text}</a>,
      }, {
        title: '动植物油',
        className: 'column-money',
        dataIndex: 'money',
      }, 
        {
        title: 'COD',
        className: 'column',
        dataIndex: 'box',
        }, {
        title: 'BOD5',
        dataIndex: 'address',
      }];
      
      const data3 = [{
        key: '3',
        name: '排放量(mg/a)',
        money:this.state.waste['动植物油'],
        box:this.state.waste['COD'],
        address: this.state.waste['BOD5'],
      }, ];

      const columns4 = [{
        title: '类型',
        dataIndex: 'name',
        render: text => <a href="javascript:;">{text}</a>,
      }, {
        title: '动植物油',
        className: 'column-money',
        dataIndex: 'money',
      }, 
        {
        title: 'COD',
        className: 'column',
        dataIndex: 'box',
        }, {
        title: 'BOD5',
        dataIndex: 'address',
      }];
      
      const data4 = [{
        key: '4',
        name: '排放量(mg/a)',
        money:this.state.effluent['动植物油']?this.state.effluent['动植物油']:'',
        box:this.state.effluent['COD']?this.state.effluent['COD']:'',
        address: this.state.effluent['BOD5']?this.state.effluent['BOD5']:'',
      }, ];

      let {streetList,waterList} = this.state;
    const streetOptions = streetList.map(street => <Option key={street.codeId}
        value={street.codeId}>{street.positionName}</Option>);
        const waterOptions = waterList.map(street => <Option key={street.codeId}
            value={street.codeId}>{street.positionName}</Option>);
    return (
        <div>
            <Row>
                <Col span={10} offset={4}>
                    <div className="echarts1" style={{height: '400px',width:'600px'}}></div>
                </Col>
            </Row>
            <br/>
            <Row>
                <Col span={18} offset={3}>
                <Table
                    columns={columns1}
                    dataSource={data1}
                    bordered
                    pagination={false}
                />
                </Col>
            </Row>
            <br/>
            <Row>
                <Col>
                    <Select defaultValue="请选择街道" style={{width: 150, margin: '5px'}}
                        onChange={this.streetSelect.bind(this)}>
                    <Option value="请选择街道">请选择街道</Option>
                    {
                    streetOptions
                    }
                    </Select>
                    <Button type="primary"  onClick={this.Product.bind(this)}>确认</Button>
                </Col>
                <Col>
                    
                </Col>
                <Col span={10} offset={4}>
                    <div className="echarts2" style={{height: '400px',width:'600px'}}></div>
                </Col>
            </Row>
            <br/>
            <Row>
                <Col span={18} offset={3}>
                <Table
                    columns={columns2}
                    dataSource={data2}
                    bordered
                    pagination={false}
                />
                </Col>
            </Row>
            <br/>
            <Row>
                <Col span={10} offset={4}>
                    <div className="echarts3" style={{height: '400px',width:'600px'}}></div>
                </Col>
            </Row>
            <br/>
            <Row>
                <Col span={18} offset={3}>
                <Table
                    columns={columns3}
                    dataSource={data3}
                    bordered
                    pagination={false}
                />
                </Col>
            </Row>
            <br/>
            <Row>
                <Col>
                    <Select defaultValue="请选择街道" style={{width: 150, margin: '5px'}}
                        onChange={this.waterSelect.bind(this)}>
                    <Option value="请选择街道">请选择街道</Option>
                    {
                    waterOptions
                    }
                    </Select>
                    <Button type="primary"  onClick={this.water.bind(this)}>确认</Button>
                </Col>
                <Col>
                    
                </Col>
                <Col span={10} offset={4}>
                    <div className="echarts4" style={{height: '400px',width:'600px'}}></div>
                </Col>
            </Row>
            <br/>
            <Row>
                <Col span={18} offset={3}>
                <Table
                    columns={columns4}
                    dataSource={data4}
                    bordered
                    pagination={false}
                />
                </Col>
            </Row>
        </div>
    );
  }
}

export default Graph;
