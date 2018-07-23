import React, {Component} from 'react';
import {
  Button,
  Table,
  Row,
  Col,
  Input,
  Pagination,
  Select,
  Modal,
  Form,
  message,
  LocaleProvider
} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import AddWrappedRegistrationForm from './AddRegistrationForm';
import UpdateWrappedRegistrationForm from './UpdateRegistrationForm';
import {Http} from '../../helpers/Http';
import {mainStore} from '../../stores';
import {QINIU} from '../../constants/oauth-constants';


const Option = Select.Option;
const Search = Input.Search;

class UserList extends Component {
  state = {
    adminList: [],
    showAdd: false,
    showDelete: false,
    showUpdate: false,
    showExport: false,
    formLayout: 'horizontal',
    username: '',
    fullName: '',
    role: '',
    page: 1,
    rows: 10,
    id: '',
    pageTotal: 0,
    token: '',
    fileList: [],
    uploadExcel: '',
    official: ''
  };

  componentWillMount() {
    this.conditionalSearch();
    Http.get('/api/v1/resource/img-token', {}, (res) => {
      if (res.status === 200) {
        this.setState({
          token: res.data.data
        });
      }
    });

  }

  pageChange(pageNumber) {
    if (this.state.type === 'globalSearch') {
      this.globalSearch('', pageNumber);
    } else {
      this.conditionalSearch(pageNumber);
    }
  }

  genre(value) {
    this.setState({
      role: value === '请选择' ? '' : value
    })
  }

  showAddModal() {
    this.setState({
      showAdd: true,
    });
  }

  showExportModal() {
    this.setState({
      showExport: true,
    });
  }

  showUpdateModal(data) {
    mainStore.data = data;
    if (data.parentId) {
      Http.get(`/api/v1/admin/findCheckAdmin`, {}, (res) => {
        for (let v of res.data.data) {
          if (v.id === data.parentId) {
            mainStore.parentName = v.fullName;
            this.setState({
              official: data.role,
              showUpdate: true,
            })
          } else {
            this.setState({
              official: data.role,
              showUpdate: true,
            })
          }
        }
      });
    } else {
      mainStore.parentName = '请选择';
      this.setState({
        official: data.role,
        showUpdate: true,
      })

    }
  }

  officialChange(ev) {
    this.setState({
      official: ev.target.value
    });
  }

  showDeleteModal(data) {
    this.setState({
      showDelete: true,
      id: data.id
    });
  }

  handleAdd() {

  };

  globalSearch(value, page) {
    let {rows} = this.state;
    let params = {
      param: value || '',
      page: isNaN(page) ? 1 : page,
      rows,
    };
    Http.post(`api/v1/admin/find-param`, params, (response) => {
      if (response.data.success) {
        let dataGrid = response.data.data.dataGrid;
        let index = 1;
        for (let i = 0; i < dataGrid.length; i++) {
          dataGrid[i].key = index++;
        }
        this.setState({
          type: 'globalSearch',
          adminList: dataGrid,
          pageTotal: response.data.data.total
        })
      }
    });
  }


  conditionalSearch(page) {
    let {username, fullName, role, rows} = this.state;
    let params = {
      username,
      fullName,
      role,
      page: isNaN(page) ? 1 : page,
      rows
    };
    Http.post('api/v1/admin/find-all', params, (response) => {
      const array = response.data.data.dataGrid;
      for (const [i, data] of array.entries()) {
        data.key = i + this.state.page * this.state.rows;
      }
      this.setState({
        type: 'conditionalSearch',
        adminList: array,
        pageTotal: response.data.data.total
      })
    })
  }
  ;

  login(ev) {
    this.setState({
      username: ev.target.value
    })
  }
  ;

  name(ev) {
    this.setState({
      fullName: ev.target.value
    })
  }
  ;

  handleExport(ev) {
    ev.preventDefault();
    let form = document.querySelector("#fomrUpload");
    let file = document.querySelector("#fileUpload").files[0];
    if (!file) {
      message.error('请选择文件');
    } else if (file.type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      message.error('请导入excel文件');
      form.reset();
    } else {
      let params = {
        uploadExcel: file
      };
      Http.post('/api/v1/admin/exportExcel', params, (response) => {
        if (response.data.success) {
          if (response.data.data.length == 0) {
            message.info('导入成功');
            form.reset();
            this.setState({
              showExport: false,
            });
          }
          if (response.data.data.length > 0) {
            message.info('导入失败');
            form.reset();
          }
        }
      })
    }
  }

  handleUpdate() {

  }

  handleDelete() {
    let {id} = this.state;
    let params = {id};
    Http.post('api/v1/admin/delete-id', params, (response) => {
      if (response.data.success === true) {
        this.setState({
          showDelete: false
        })
      }
      if (this.state.type === 'globalSearch') {
        this.globalSearch();
      } else {
        this.conditionalSearch();
      }
    })
  }

  handleCancel() {
    let form = document.querySelector("#fomrUpload");
    if (form && form.length > 0) {
      form.reset();
    }
    this.setState({
      showAdd: false,
      showDelete: false,
      showUpdate: false,
      showExport: false,
    });
    this.conditionalSearch();
  }

  render() {
    const columns = [
      {
        title: '登录账号',
        dataIndex: 'username',
        key: '登录账号',
        width: 150
      },
      {
        title: '姓名',
        dataIndex: 'fullName',
        key: '姓名',
        width: 150
      },
      {
        title: '角色',
        width: 150,
        render: (data) => {
          let role = data.role;
          return (
            <div>
              {
                role === 1 ? '普查员' : (role === 0?'系统管理员':'审核员')
              }
            </div>
          )
        },
        key: '角色',
      },
      {
        title: '联系电话',
        width: 150,
        dataIndex: 'mobile',
        key: '联系电话',
      },
      {
        title: '操作',
        dataIndex: '',
        width: 220,
        key: 'x',
        render: (data) => {
          return (
            <div>
              <a style={{margin: '10px'}} onClick={this.showUpdateModal.bind(this, data)}>修改</a>
              <a style={{margin: '10px', color: '#f00'}} onClick={this.showDeleteModal.bind(this, data)}>删除</a>
            </div>
          )
        }
      }
    ];
    const {showAdd, showUpdate, showDelete, showExport, pageTotal, token, official} = this.state;
    const props = {
        action: QINIU.HUADONG.ACTION,
        name: 'file',
        fileList: this.state.fileList,
        data: {
          token,
        },
        onChange: (file) => {
          this.setState({
            fileList: file.fileList
          })
        },
      }
    ;

    return (
      <div>
        <Row>
          <Col span={24} offset={1} style={{fontWeight: 700, fontSize: 18, lineHeight: '40px'}}>用户管理</Col>
        </Row>
        <Row>
          <Col span={8} offset={6}>
            <div style={{marginBottom: 16}}>
              <Search
                placeholder="请输入姓名"
                onSearch={this.globalSearch.bind(this)}
                enterButton
              />
            </div>
          </Col>
        </Row>
        <Row style={{marginBottom: '15px'}}>
          <Col span={14} offset={6}>
            <Col span={3} offset={0} style={{width: '85px'}}>
              <label style={{lineHeight: '30px'}}>类型：</label>
            </Col>
            <Col span={5} offset={0}>
              <Select defaultValue="请选择" style={{width: '100%'}} onChange={this.genre.bind(this)}>
                <Option value={'请选择'}>请选择</Option>
                <Option value={2}>审核员</Option>
                <Option value={1}>普查员</Option>
              </Select>
            </Col>
          </Col>
        </Row>
        <Row style={{marginBottom: '15px'}}>
          <Col span={20} offset={6}>
            <Col span={3} style={{width: '85px'}}>
              <label style={{lineHeight: '30px'}}>登录账号：</label>
            </Col>
            <Col span={5}>
              <Input placeholder="" offset={3} onChange={this.login.bind(this)}/>
            </Col>
            <Col span={3} offset={1} style={{width: '85px'}}>
              <label style={{lineHeight: '30px'}}>姓名：</label>
            </Col>
            <Col span={5}>
              <Input placeholder="" offset={3} onChange={this.name.bind(this)}/>
            </Col>
            <Col span={4} offset={1}>
              <Button type="primary" onClick={this.conditionalSearch.bind(this)}>查询</Button>
            </Col>
          </Col>
        </Row>
        <Row style={{marginBottom: '15px'}}>
          <Col span={4} offset={1} style={{fontWeight: 700, fontSize: 18, lineHeight: '40px'}}>用户列表</Col>
          <Col span={2} offset={10}>
            <Button type="primary" onClick={this.showAddModal.bind(this)}>新建用户</Button>
          </Col>
          <Col span={2} offset={2}>
            <Button type="primary" onClick={this.showExportModal.bind(this)}>批量导入</Button>
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <LocaleProvider locale={zh_CN}>
            <Table columns={columns} dataSource={this.state.adminList} bordered={true} pagination={false}
                   align={'center'}/>
          </LocaleProvider>
        </Row>
        <Row type="flex" justify="center" style={{marginTop: '50px'}}>
          <Col span={8} offset={5}>
            <Pagination defaultCurrent={1} total={pageTotal} onChange={this.pageChange.bind(this)}/>
          </Col>
        </Row>
        <Modal
          visible={showAdd}
          maskClosable={false}
          title="新建用户"
          onOk={this.handleAdd.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          style={{width: '880px'}}
          footer={[]}
        >
          <AddWrappedRegistrationForm showAdd={showAdd}
                                      handleCancel={this.handleCancel.bind(this)}/>

        </Modal>

        <Modal
          visible={showUpdate}
          maskClosable={false}
          title="修改用户"
          onOk={this.handleUpdate.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          footer={[]}
        >
          <UpdateWrappedRegistrationForm showUpdate={showUpdate} official={official}
                                         officialChange={this.officialChange.bind(this)}
                                         handleCancel={this.handleCancel.bind(this)}/>
        </Modal>

        <Modal
          visible={showExport}
          maskClosable={false}
          title="批量导入"
          onOk={this.handleExport.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          footer={[
            <Button key="submit" type="primary" onClick={this.handleExport.bind(this)}>
              导入
            </Button>,
            <Button key="back" onClick={this.handleCancel.bind(this)}>取消</Button>,
          ]}

        >
          <Form id="fomrUpload" onSubmit={this.handleSubmit}>
            <Row>
              <Col span={24}>
                <label htmlFor="fileUpload" style={{margin: '5px'}}>用户导入：</label>
                <input type="file" name="uploadExcel" id="fileUpload" style={{display: 'inline-block'}}/>
              </Col>
            </Row>
          </Form>
        </Modal>
        <Modal
          visible={showDelete}
          maskClosable={false}
          title="删除提示"
          onOk={this.handleDelete.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          footer={[
            <Button key="submit" type="primary" htmlType="submit" onClick={this.handleDelete.bind(this)}>
              确定
            </Button>,
            <Button key="back" onClick={this.handleCancel.bind(this)}>取消</Button>,
          ]}
        >
          <p>确认要删除选择的信息?</p>
        </Modal>
      </div>
    )
      ;
  }
}

export default UserList;
