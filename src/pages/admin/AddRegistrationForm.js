import React, {Component} from 'react';
import {Row, Col, Button, Form, Input, message, Radio, Select} from 'antd';
import {Http} from '../../helpers/Http';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

class AddRegistrationForm extends Component {

  state = {
    showAdd: this.props.showAdd,
    confirmDirty: false,
    username: '',
    mobile: '',
    password: '',
    fullName: '',
    official: '',
    roleSwitch: false,
    parentId: '',
    parentList: [],
  };

  officialFn(ev) {
    if (ev.target.value === 1) {
      this.setState({
        roleSwitch: true,
        parentList: [],
        parentId: '',
      })
      Http.get(`/api/v1/admin/findCheckAdmin`, {}, (response) => {
        this.setState({
          parentList: response.data.data
        })
      });
    } else {
      this.setState({
        roleSwitch: false,

      })
    }
    this.setState({
      official: ev.target.value
    })
  }

  parentFn(value) {
    this.setState({
      parentId: value
    })
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({
      confirmDirty: this.state.confirmDirty || !!value
    });
  }
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('密码不一致');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], {force: true});
    }
    callback();
  }

  compareToPhone = (rule, value, callback) => {
    if (value && !(/^1[3|4|5|8][0-9]\d{4,8}$/.test(value))) {
      callback('手机号码不正确');
    } else {
      callback();
    }
  }
  handleWebsiteChange = (value) => {
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
    }
    this.setState({autoCompleteResult});
  }

  handleSubmit() {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        console.log(err);
        return;
      }
      Http.post('api/v1/admin/create', values, (response) => {
        if (response.data.success == true) {
          message.info(`新增成功`);
          this.props.form.resetFields();
          this.props.handleCancel();
        } else {
          message.info(response.data.megetFieldDecoratorssage);
        }

      })
    });
  }

  render() {
    let {official, roleSwitch, parentList} = this.state;
    const {getFieldDecorator} = this.props.form;

    const parentOptions = parentList.map(county => <Option key={county.id}>{county.fullName}</Option>);

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
    };
    return (
      <Form>
        <FormItem
          {...formItemLayout}
          label="姓名"
        >
          {getFieldDecorator('fullName', {
            rules: [{
              required: true, message: '请输入姓名',
            }],
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="登录账号"
        >
          {getFieldDecorator('username', {
            rules: [{
              required: true, message: '请输入账号',
            }],
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="密码"
        >
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: '请输入密码',
            }, {
              validator: this.validateToNextPassword,
            }],
          })(
            <Input type="password"/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="确认密码"
        >
          {getFieldDecorator('confirm', {
            rules: [{
              required: true, message: '请再次输入密码',
            }, {
              validator: this.compareToFirstPassword,
            }],
          })(
            <Input type="password" onBlur={this.handleConfirmBlur}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="联系手机"
        >
          {getFieldDecorator('mobile', {
            rules: [{required: true, message: '请输入手机号码'},
              {
                validator: this.compareToPhone,
              }],
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="角色 "
        >
          {getFieldDecorator('role', {initialValue: official}, {
            rules: [{required: true, message: '请输入角色'},
            ],
          })(
            <RadioGroup onChange={this.officialFn.bind(this)}>
              <Radio value={1}>普查员</Radio>
              <Radio value={2}>审核员</Radio>
            </RadioGroup>
          )}
        </FormItem>
        {
          roleSwitch ?
            <div>
              <FormItem
                {...formItemLayout}
                label="所属审核员"
              >
                {getFieldDecorator('parentId', {initialValue: '请选择'}, {
                  rules: [{required: true, message: '请选择所属审核员'},
                  ],
                })(
                  <Select defaultValue="请选择" style={{width: 120}} onChange={this.parentFn.bind(this)}>
                    <Option value="请选择">请选择</Option>
                    {
                      parentOptions
                    }
                  </Select>
                )}
              </FormItem>
            </div> : ''
        }
        <FormItem>
          <Row>
            <Col span={2} offset={15}>
              <Button type="primary" onClick={this.handleSubmit.bind(this)}>
                提交
              </Button>
            </Col>
            <Col span={2} offset={3}>
              <Button type="danger" onClick={this.props.handleCancel}>
                取消
              </Button>
            </Col>
          </Row>
        </FormItem>
      </Form>
    );
  }
}

const AddWrappedRegistrationForm = Form.create()(AddRegistrationForm);

export default AddWrappedRegistrationForm;