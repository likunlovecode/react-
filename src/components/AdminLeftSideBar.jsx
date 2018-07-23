import React from 'react';
import {Link} from 'react-router-dom';
import {Layout, Menu, Icon} from 'antd';

const {Sider} = Layout;
const { SubMenu } = Menu;

class AdminLeftSideBar extends React.Component {
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
              <Link to={'/v1/admin/company-list'}>
                <Icon type="home"/>
                <span>企业管理</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="user-list">
              <Link to={'/v1/admin/user-list'}>
                <Icon type="user"/>
                <span>用户管理</span>
              </Link>
            </Menu.Item>
            {/* <Menu.Item key="data">
              <Link to={'/v1/admin/data'}>
                <Icon type="coffee"/>
                <span>数据统计</span>
              </Link>
            </Menu.Item> */}
            <SubMenu key="sub1" title={<span><Icon type="coffee" />数据统计</span>}>
            <Menu.Item key="data">
              <Link to={'/v1/admin/data/Diagram'}>
                <Icon type="laptop"/>
                <span>热力图</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to={'/v1/admin/data/Graph'}>
                <Icon type="laptop"/>
                <span>条形图</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to={'/v1/admin/data'}>
                <Icon type="laptop"/>
                <span>餐企分类分析</span>
              </Link>
            </Menu.Item>
          </SubMenu>
          </Menu>
        </Sider>
    );
  }
}

export default AdminLeftSideBar;
