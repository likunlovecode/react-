import React from 'react';
import {Switch, Route} from 'react-router-dom';
import {Layout} from 'antd';
import CompanyList from './CompanyList';
import UserList from './UserList';
import Update from '../user/Update';
import Details from './Details';
import AdminLeftSideBar from '../../components/AdminLeftSideBar';
import TopBar from '../../components/TopBar';
import DataStatistics from '../data/DataStatistics';
import Diagram from '../data/Diagram';
import Graph from '../data/Graph';

const {Content} = Layout;

class AdminDashboard extends React.Component {
  state = {
    collapsed: false,
  };

  async componentWillMount() {

  }

  collapsedClick() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render() {
    const prefix = this.props.match.path;
    return (
      <Layout>
        <AdminLeftSideBar collapsed={this.state.collapsed}/>
        <Layout>
          <TopBar history={this.props.history} collapsedClick={this.collapsedClick.bind(this)}
                  collapsed={this.state.collapsed}/>
          <Content style={{margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280}}>
            <Switch>
              <Route path={`${prefix}/company-list`} exact component={CompanyList}/>
              <Route path={`${prefix}/user-list`} exact component={UserList}/>
              <Route path={`${prefix}/details/:id`} exact component={Details}/>
              <Route path={`${prefix}/data`} exact component={DataStatistics}/>
              <Route path={`${prefix}/data/Diagram`} exact component={Diagram}/>
              <Route path={`${prefix}/data/Graph`} exact component={Graph}/>
              <Route path={`${prefix}/update/:id`} exact component={Update}/>
            </Switch>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default AdminDashboard;
