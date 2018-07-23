import React from 'react';
import {Switch, Route} from 'react-router-dom';
import {Layout} from 'antd';
import CompanyList from '../admin/CompanyList';
import Condition from './Condition';
import Newly from './Newly';
import Update from './Update';
import Product from './Product';
import Details from '../admin/Details'
import DataStatistics from '../data/DataStatistics';
import UserLeftSideBar from '../../components/UserLeftSideBar';
import TopBar from '../../components/TopBar'

const {Content} = Layout;

class UserDashboard extends React.Component {
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
          {/*<UserLeftSideBar collapsed={this.state.collapsed}/>*/}
          <Layout>
            <TopBar history={this.props.history} collapsedClick={this.collapsedClick.bind(this)} collapsed={this.state.collapsed}/>
            <Content style={{margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280}}>
              <Switch>
                <Route path={`${prefix}/company-list`} exact component={CompanyList}/>
                <Route path={`${prefix}/condition`} exact component={Condition}/>
                <Route path={`${prefix}/newly`} exact component={Newly}/>
                <Route path={`${prefix}/product`} exact component={Product}/>
                <Route path={`${prefix}/details/:id`} exact component={Details}/>
                <Route path={`${prefix}/data`} exact component={DataStatistics}/>
                <Route path={`${prefix}/update/:id`} exact component={Update}/>
              </Switch>
            </Content>
          </Layout>
        </Layout>
    );
  }
}

export default UserDashboard;
