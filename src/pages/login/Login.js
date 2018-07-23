import React, {Component} from 'react';
import {Row, Col, Form, Icon, Input, Button, message} from 'antd';
import '../../css/login.scss';
import {PLATFORM, ENV} from '../../constants/constans';
import {OAuthHelper} from '../../helpers/OAuthHelper';
import {mainStore} from '../../stores';
import {OAUTH} from '../../constants/oauth-constants';

const FormItem = Form.Item;

class Login extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        OAuthHelper.login(values.username, values.password, (data) => {
          // this.props.history.replace('/test/cordova-camera')
          {
            this.oauth()
          }
        });
      } else {
      }
    });
  };

  oauth() {
    if (mainStore.authUser.role === OAUTH.ADMIN_ROLE && this.IsPC()) {
      this.props.history.replace('/v1/admin/company-list')
    } else if (mainStore.authUser.role === OAUTH.USER_ROLE) {
      this.props.history.replace('/v1/user/company-list');
    } else if (mainStore.authUser.role === OAUTH.CHECK_ROLE ) {
      this.props.history.replace('/v1/user/company-list');
    } else {
      message.error('该账号无权限不能登录', 4);
      this.props.history.replace('/login');
    }
  }

  IsPC() {
    let userAgentInfo = navigator.userAgent;
    let Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    let flag = true;
    for (let v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false;
        break;
      }
    }
    return flag;
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <div id="login">
        <Form onSubmit={this.handleSubmit} className="login-form">
          <h3 style={{fontSize:'29px',width:'100%',height:'50px',letterSpacing:'1.3rem'}}>餐饮污染源普查信息系统</h3>
          <div id="content">
            <FormItem style={{marginTop:"100px"}}>
              <Row>
                <Col span={18} push={6} >
                  {getFieldDecorator('username', {
                    rules: [{required: true, message: '请输入用户名!'}],
                  })(
                    <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="请输入用户名"/>
                  )}
                </Col>
                <Col span={6} pull={18} style={{color: '#fff'}}><span style={{fontSize:'15px'}}>账号：</span></Col>
              </Row>
            </FormItem>
            <FormItem>
              <Row>
                <Col span={18} push={6}>
                  {getFieldDecorator('password', {
                    rules: [{required: true, message: '请输入用密码!'}],
                  })(
                    <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} type="password"
                           placeholder="请输入用密码"/>
                  )}
                </Col>
                <Col span={6} pull={18} style={{color: '#fff'}}><span style={{fontSize:'15px'}}>密码：</span></Col>
              </Row>

            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit" className="login-form-button" style={{marginTop:'1.1rem'}}>
                登录
              </Button>
            </FormItem>
          </div>
        </Form>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(Login);
export default WrappedNormalLoginForm;
