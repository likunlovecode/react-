import React, {Component} from 'react';
import {Form, Row, Col, Input, Button, message} from 'antd';
import {Http} from '../helpers/Http';

const FormItem = Form.Item;

class ChangePasswordForm extends Component {
  state = {};

  componentWillMount() {

  }

  handleSubmit() {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {

      } else {
        if (values.newPassword !== values.confirmPassword) {
          message.error('两次密码输入的不一致，请重新填写');
          return;
        }
        let params = {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword
        };
        Http.post('/api/v1/admin/modifyPassword-id', params, (response) => {
          if (response.data.success) {
            message.info(`密码修改成功`, 4);
            this.props.form.resetFields();
            this.props.history.push('/login');
          } else {
            message.error(response.data.data);
          }
        })
      }
    });
  }

  render() {
    const {getFieldDecorator} = this.props.form;
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
      <Form className="login-form" onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="原密码"
        >
          {getFieldDecorator('oldPassword', {
            rules: [{
              required: true, message: '请输入原密码',
            }],
          })(
            <Input type="password"/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="新密码"
        >
          {getFieldDecorator('newPassword', {
            rules: [{
              required: true, message: '请输入新密码',
            }],
          })(
            <Input type="password"/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="新密码验证"
        >
          {getFieldDecorator('confirmPassword', {
            rules: [{
              required: true, message: '请再次输入新密码',
            }],
          })(
            <Input type="password"/>
          )}
        </FormItem>
        <FormItem style={{marginBottom: 0}}>
          <Row>
            <Col span={2} offset={15}>
              <Button type="primary" onClick={this.handleSubmit.bind(this)}>
                提交
              </Button>
            </Col>
            <Col span={2} offset={3} onClick={this.props.handleCancel}>
              <Button>
                取消
              </Button>
            </Col>
          </Row>
        </FormItem>
      </Form>
    )
  }
}

const ChangePassword = Form.create()(ChangePasswordForm);

export default ChangePassword;
