import React from 'react';
import {Link} from 'react-router-dom';
import {Layout, Menu, Icon} from 'antd';

const {Sider} = Layout;

class UserLeftSideBar extends React.Component {
  state = {};

  render() {
    let len = window.location.href.split('/').length;
    let SelectedKeys = window.location.href.split('/')[len - 1];
    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={this.props.collapsed}>
          <div className="logo"/>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={[SelectedKeys]} selectable={true}>
            <Menu.Item key="company-list">
              <Link to={'/v1/user/company-list'}>
                <Icon type="home"/>
                <span>企业管理</span>
              </Link>
            </Menu.Item>
          </Menu>
        </Sider>
    );
  }
}

export default UserLeftSideBar;
