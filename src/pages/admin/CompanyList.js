import React, {Component} from 'react';
import {
  Button,
  Table,
  Row,
  Col,
  Input,
  Pagination,
  Select,
  DatePicker,
  Modal,
  LocaleProvider,
  Radio,
  message
} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import {PAGESIZE} from '../../constants/constans';
import {mainStore} from '../../stores';
import {Http} from '../../helpers/Http';
import {OAUTH} from '../../constants/oauth-constants';
import moment from 'moment';

const Search = Input.Search;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const {TextArea} = Input;

class CompanyList extends Component {
  state = {
    showtext: false,
    reason: '',
    data: [],
    showDelete: false,
    showCheck: false,
    userId: '',
    pageIndex: 0,
    pageTotal: 0,
    menuList: [],
    menuId: '',
    environmentalProcedures: '',
    search: '',
    startValue: null,
    endValue: null,
    endOpen: false,
    checkStatus: 1,
    checkId: '',
    resultList: [
      {
        id: 1,
        name: '已提交'
      }, {
        id: 0,
        name: '未提交'
      }
    ],
    result: '',
    type: 'globalSearch',
    pathname: this.props.location.pathname.split('/')[this.props.location.pathname.split('/').length - 2]
  };

  componentWillMount() {
    this.globalSearch();
    Http.get(`/api/menu/find-all`, {}, (response) => {
      this.setState({
        menuList: response.data.data
      })
    });
  }

  globalSearch(pageNumber) {
    let {startValue, endValue, menuId, environmentalProcedures, result, checkId} = this.state;
    let params = {
      environmentalProcedures,
      menuId,
      result,
      checkStatus: checkId,
      startDate: startValue ? moment(startValue._d).format('YYYY-MM-DD') : '',
      endDate: endValue ? moment(endValue._d).format('YYYY-MM-DD') : '',
      page: isNaN(pageNumber) ? 1 : pageNumber,
      rows: PAGESIZE
    };
    if (params.endDate) {
      let arr = params.endDate.split('-');
      arr[2] = (Number(arr[2]) + 1) >= 10 ? String(Number(arr[2]) + 1) : 0 + String(Number(arr[2]) + 1);
      params.endDate = arr.join('-');
    }

    Http.post(`/api/companyInfo/find-all`, params, (response) => {
      if (response.data.success) {
        let dataGrid = response.data.data.dataGrid;
        let index = 1;
        for (let i = 0; i < dataGrid.length; i++) {
          dataGrid[i].key = index++;
        }
        this.setState({
          type: 'globalSearch',
          data: dataGrid,
          pageTotal: response.data.data.total
        })
      }
    });
  }

  ConditionalSearch(value, pageNumber) {
    this.setState({
      data: [],
      search: value,
    });
    let params = {
      param: value || '',
      page: isNaN(pageNumber) ? 1 : pageNumber,
      rows: PAGESIZE
    };
    Http.post(`/api/companyInfo/find-param`, params, (response) => {
      if (response.data.success) {
        let dataGrid = response.data.data.dataGrid;
        let index = 1;
        for (let i = 0; i < dataGrid.length; i++) {
          dataGrid[i].key = index++;
        }
        this.setState({
          type: 'conditionalSearch',
          data: dataGrid,
          pageTotal: response.data.data.total
        })
      }
    });
  }

  pageChange(pageNumber) {
    if (this.state.type === 'globalSearch') {
      this.globalSearch(pageNumber);
    } else {
      this.ConditionalSearch(this.state.search, pageNumber);
    }
  }

  statusChange(value) {
    if (value === 1 || value === 0) {
      this.setState({
        result: value,
        checkId: '',
      })
    } else if (value === 3) {
      this.setState({
        checkId: 0,
        result: ''
      })
    } else if (value === 4) {
      this.setState({
        checkId: 1,
        result: ''
      })
    } else if (value === 5) {
      this.setState({
        checkId: 2,
        result: ''
      })
    } else {
      this.setState({
        result: '',
        checkId: ''
      })
    }
  }

  styleOfCooking(value) {
    this.setState({
      menuId: value === '请选择' ? '' : value
    })
  }

  environmental(value) {
    this.setState({
      environmentalProcedures: value === '请选择' ? '' : value
    })
  }

  results(data, index) {
    return (
      <option key={index} value={data.id}>
        {data.name}
      </option>
    );
  }

  menus(data, index) {
    return (
      <option key={index} value={data.id}>
        {data.name}
      </option>
    );
  }

  environment(data, index) {
    return (
      <option key={index} value={data}>
        {data}
      </option>
    );
  }

  newly() {
    this.props.history.push('/v1/user/newly');
  }

  update(data) {
    Http.get(`/api/companyInfo/find-id?companyInfoId=${data.id}`, {}, (response) => {
      if (response.data.success) {
        mainStore.enterpriseDetails = response.data.data;
        let id = response.data.data.id;
        this.props.history.push(`/v1/${this.state.pathname}/update/${id}`);
      }
    });
  }

  details(data) {
    Http.get(`/api/companyInfo/find-id?companyInfoId=${data.id}`, {}, (response) => {
      if (response.data.success) {
        mainStore.enterpriseDetails = response.data.data;
        let id = response.data.data.id;
        this.props.history.push(`/v1/${this.state.pathname}/details/${id}`);
      }
    });
  }

  handleCheck() {
    let {companyInfoId, checkStatus, reason} = this.state;
    if (reason.length > 50) {
      message.warning('请不要超过50个字', 4)
    } else {
      let params = {
        companyInfoId,
        checkStatus,
        reason,
      };
      Http.post(`/api/companyInfo/checkCompany`, params, (response) => {
        if (response.data.success) {
          this.setState({
            showCheck: false,
            checkStatus: 1,
            showtext: false,
          });
          message.info('审核成功');
          this.globalSearch();
        } else {
          message.info(response.data.data);
        }
      });
    }

  }

  check(data) {
    this.setState({
      companyInfoId: data.id,
      showCheck: true,
      showtext:false,
    })
  }

  downloadWord(id) {
    window.location.href = `${OAUTH.BASE_URL}/api/companyInfo/downloadWord?id=${id}`;
  }

  delete(data) {
    
    this.setState({
      showDelete: true,
      userId: data.id
    });
  }

  handleCancel() {
    this.setState({
      showDelete: false,
      showCheck: false,
      checkStatus: 1,
    });
  }

  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  checkCompany(ev) {
    if (ev.target.value === 1) {
      this.setState({
        showtext: false,
        checkStatus: ev.target.value
      })
    } else {
      this.setState({
        showtext: true,
        checkStatus: ev.target.value
      })
    }
  };

  textFn(ev) {
    this.setState({
      reason: ev.target.value
    })
  }

  onStartChange = (value) => {
    this.onChange('startValue', value);
  };

  onEndChange = (value) => {
    this.onChange('endValue', value);
  };

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({endOpen: true});
    }
  };

  handleEndOpenChange = (open) => {
    this.setState({endOpen: open});
  };

  handleDelete() {
    let {userId, type} = this.state;
    Http.get(`/api/companyInfo/delete-id?companyInfoId=${userId}`, {}, (response) => {
      if (response.data.success) {
        message.info('删除成功',3)
        this.setState({
          showDelete: false,
        });
        if (type === 'globalSearch') {
          this.globalSearch();
        } else {
          this.ConditionalSearch();
        }
      }
    });
  }

  render() {
    const columns = [
      {
        title: '餐厅名称',
        dataIndex: 'restaurantName',
        width: 150
      },
      {
        title: '餐饮类型',
        width: 150,
        render: (data) => {
          return (
            <div>
              {data.menu ? data.menu.name : ''}
            </div>
          )
        }
      },
      {
        title: '录入日期',
        width: 150,
        render: (data) => {
          return (
            <div>
              {moment(data.createdDate).format('YYYY-MM-DD')}
            </div>
          )
        }
      },
      {
        title: '普查员',
        dataIndex: 'fullName',
        width: 100
      },
      {
        title: '提交状态',
        width: 100,
        render: (data) => {
          return (
            <div>
              {
                data.result === 1 ?
                  '已提交' : '未提交'
              }
            </div>
          )
        }
      },
      {
        title: '审核状态',
        width: 100,
        render: (data) => {
          let checkStatus = data.checkStatus;
          return (
            <div>
              {
                checkStatus === 1 ? '已审核' : (checkStatus === 2 ? '审核未通过' : '未审核')

              }
            </div>
          )
        }
      },
      {
        title: '未通过原因',
        width: 130,
        render: (data) => {
          let checkStatus = data.checkStatus;
          return (
            <div>
              {
                checkStatus===2?
                data.reason:''

              }
            </div>
          )
        }
      },
      {
        title: '操作',
        width: 220,
        render: (data) => {
          let checkStatus = data.checkStatus;
          return (
            <div>
              {
                <div>
                  <a style={{margin: '5px', color: '#1890ff'}}
                     onClick={this.downloadWord.bind(this, data.id)}>下载</a>
                  <a style={{margin: '5px', color: '#5cb85c'}} onClick={this.update.bind(this, data)}>修改</a>
                  <a style={{margin: '5px', color: '#ff0000'}} onClick={this.delete.bind(this, data)}>删除</a>
                  <a style={{margin: '5px', color: '#f0ad4e'}} onClick={this.details.bind(this, data)}>详情</a>
                  <a style={{margin: '5px', color: '#00d2ff'}} onClick={this.check.bind(this, data)}>审核</a>
                </div>
              }
            </div>
          )
        }
      }
    ];
    let {showDelete, showCheck, showtext, pageTotal, menuList, startValue, endValue, endOpen, checkStatus} = this.state;
    const menuOptions = menuList.map(menu => <Option key={menu.id}>{menu.name}</Option>);
    return (
      <div>
        <Row>
          <Col span={24} offset={1} style={{fontWeight: 700, fontSize: 18, lineHeight: '40px'}}>企业管理</Col>
        </Row>
        <Row>
          <Col xs={{span: 18, offset: 1}} sm={{span: 16, offset: 3}} md={{span: 8, offset: 4}}>
            <div style={{marginBottom: 16}}>
              <Search
                placeholder="请输入餐厅名称"
                onSearch={this.ConditionalSearch.bind(this)}
                enterButton
              />
            </div>
          </Col>
          <Col offset={1} span={2}>
          </Col>
        </Row>
        <Row style={{marginBottom: '15px'}}>
          <Col md={{offset: 2, span: 20}} sm={{offset: 1, span: 22}} xs={{offset: 0, span: 24}}
               lg={{offset: 3, span: 18}}>
            <Col style={{marginBottom: '15px'}} md={{span: 7, offset: 1}} sm={{offset: 1, span: 11}}
                 xs={{offset: 1, span: 23}}>
              <Col span={10}>
                <label style={{lineHeight: '30px'}}>当前状态：</label>
              </Col>
              <Col span={14}>
                <Select defaultValue="请选择" style={{width: '100%'}} onChange={this.statusChange.bind(this)}>
                  <Option value="请选择">请选择</Option>
                  <Option value={1}>已提交</Option>
                  <Option value={0}>未提交</Option>
                  <Option value={3}>未审核</Option>
                  <Option value={4}>已审核</Option>
                  <Option value={5}>审核未通过</Option>
                </Select>
              </Col>
            </Col>
            <Col style={{marginBottom: '15px'}} md={{span: 7, offset: 1}} sm={{offset: 1, span: 11}}
                 xs={{offset: 1, span: 23}}>
              <Col span={10}>
                <label style={{lineHeight: '30px'}}>餐饮类型：</label>
              </Col>
              <Col span={14}>
                <Select defaultValue="请选择" style={{width: '100%'}} onChange={this.styleOfCooking.bind(this)}>
                  <Option value="请选择">请选择</Option>
                  {
                    menuOptions
                  }
                </Select>
              </Col>
            </Col>
            <Col style={{marginBottom: '15px'}}
                 md={{span: 7, offset: 1}} sm={{offset: 1, span: 11}} xs={{offset: 1, span: 23}}>
              <Col span={10}>
                <label style={{lineHeight: '30px'}}>起始日期：</label>
              </Col>
              <Col span={13}>
                <LocaleProvider locale={zh_CN}>
                  <DatePicker
                    disabledDate={this.disabledStartDate}
                    showTime
                    format="YYYY-MM-DD"
                    value={startValue}
                    placeholder="开始时间"
                    onChange={this.onStartChange}
                    onOpenChange={this.handleStartOpenChange}
                  />
                </LocaleProvider>
              </Col>
            </Col>
            <Col style={{marginBottom: '15px'}}
                 md={{span: 7, offset: 1}} sm={{offset: 1, span: 11}} xs={{offset: 1, span: 23}}>
              <Col span={10}>
                <label style={{lineHeight: '30px'}}>结束日期：</label>
              </Col>
              <Col span={13}>
                <LocaleProvider locale={zh_CN}>
                  <DatePicker
                    disabledDate={this.disabledEndDate}
                    showTime
                    format="YYYY-MM-DD"
                    value={endValue}
                    placeholder="结束时间"
                    onChange={this.onEndChange}
                    open={endOpen}
                    onOpenChange={this.handleEndOpenChange}
                  />
                </LocaleProvider>
              </Col>
            </Col>
            <Col offset={1} span={2}>
              <Button type="primary" onClick={this.globalSearch.bind(this)}>查询</Button>
            </Col>
          </Col>
        </Row>
        <Row style={{marginBottom: '15px', marginTop: '40px'}}>
          <Col span={12} offset={1} style={{fontWeight: 700, fontSize: 18, lineHeight: '40px'}}>企业列表</Col>
          <Col span={4} offset={7}>
            {
              mainStore.authUser.role === 1 || mainStore.authUser.role === 2?
                <Button type="primary" offset={2} onClick={this.newly.bind(this)}
                        style={{marginTop: '5px'}}>新建企业</Button> : ''
            }
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <LocaleProvider locale={zh_CN}>
            <Table columns={columns} rowKey='key' dataSource={this.state.data} bordered={true}
                   pagination={false}/></LocaleProvider>
        </Row>
        <Row type="flex" justify="center" style={{marginTop: '50px'}}>
          <Col span={8}>
            <Pagination defaultCurrent={1} total={pageTotal} align={'center'} onChange={this.pageChange.bind(this)}/>
          </Col>
        </Row>
        <Modal
          visible={showDelete}
          maskClosable={false}
          title="删除提示"
          onOk={this.handleDelete.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          footer={[
            <Button key="submit" type="primary" onClick={this.handleDelete.bind(this)}>
              确定
            </Button>,
            <Button key="back" onClick={this.handleCancel.bind(this)}>取消</Button>,
          ]}
        >
          <p>确认要删除选择的信息?</p>
        </Modal>
        <Modal
          visible={showCheck}
          maskClosable={false}
          title="审核"
          onOk={this.handleCheck.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          footer={[
            <Button key="submit" type="primary" onClick={this.handleCheck.bind(this)}>
              确定
            </Button>,
            <Button key="back" onClick={this.handleCancel.bind(this)}>取消</Button>,
          ]}
        >
          <div>
            <RadioGroup name="checkCompany" value={checkStatus} onChange={this.checkCompany.bind(this)}>
              <Radio value={1}>通过</Radio>
              <Radio value={2}>不通过</Radio>
            </RadioGroup>
            {
              showtext ?
                <TextArea style={{marginTop: '20px'}} rows={4} onChange={this.textFn.bind(this)}
                          placeholder="字数请不要超过50个"/> : ""
            }
          </div>

        </Modal>
      </div>
    );
  }
}

export default CompanyList;
