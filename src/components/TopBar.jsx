import React from 'react';
import {Modal, Icon, Layout, Row, Col, Menu, Dropdown} from 'antd';
import {mainStore} from '../stores';
import ChangePassword from './ChangePassword'
import {OAuthHelper} from '../helpers/OAuthHelper';

const {Header} = Layout;

class TopBar extends React.Component {
  state = {
    username: mainStore.authUser.fullName,
    showChange: false,
    showLogout: false
  };

  toggle() {
    this.props.collapsedClick();
  };

  handleLogout() {
    OAuthHelper.cleanStorage();
    this.props.history.push('/login');
  }

  logout() {
    this.setState({
      showLogout: true
    })
  }

  ChangePassword() {
    this.setState({
      showChange: true,
    })
  }

  handleChange() {
    this.setState({
      showChange: false,
    })
  }

  handleCancel() {
    this.setState({
      showChange: false,
      showLogout: false
    })
  }

  render() {
    const menu = (
      <Menu>
        <Menu.Item key="1" onClick={this.ChangePassword.bind(this)}>修改密码</Menu.Item>
        <Menu.Item key="2" onClick={this.logout.bind(this)}>退出登录</Menu.Item>
      </Menu>
    );
    let {showChange, showLogout} = this.state;
    return (
      <Header style={{background: '#fff', padding: 0}}>
        <Row>
          <Col sm={{span: 15}} md={{span: 13}}>
            {
              mainStore.authUser.role === 1 ? '' : <Icon
                className="caret-down"
                type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggle.bind(this)}
              />
            }
          </Col>
          <Col sm={{span: 8, offset: 1}} md={{span: 4, offset: 7}}>
            <Dropdown overlay={menu}>
              <a className="ant-dropdown-link" href="#">
                {this.state.username}
                <Icon type="down"/>
              </a>
            </Dropdown>
          </Col>
        </Row>
        <Modal
          visible={showChange}
          maskClosable={false}
          title="修改密码"
          footer={[]}
          onOk={this.handleChange.bind(this)}
          onCancel={this.handleCancel.bind(this)}
        >
          <ChangePassword history={this.props.history} handleCancel={this.handleCancel.bind(this)}/>
        </Modal>
        <Modal
          visible={showLogout}
          maskClosable={false}
          title="退出登录"
          okText="确认"
          cancelText="取消"
          onOk={this.handleLogout.bind(this)}
          onCancel={this.handleCancel.bind(this)}
        >
          <p>你确定要退出登录吗？</p>
        </Modal>
      </Header>
    );
  }
}

export default TopBar;
