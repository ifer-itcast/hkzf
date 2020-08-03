import React, { Component } from "react";
import { Route } from "react-router-dom";
import { TabBar } from "antd-mobile";

// 首页
import Index from '../Index';
// 房列表
import HouseList from '../HouseList';
// 资讯
import News from '../News';
// 我的
import Profile from '../Profile';

import "./index.css";
export default class Home extends Component {
    state = {
        selectedTab: this.props.location.pathname
    };
    render() {
        return (
            <div className="home">
                {/* 二级路由出口在 Home 组件里 */}
                <Route path="/home/index" component={Index}/>
                <Route path="/home/list" component={HouseList}/>
                <Route path="/home/news" component={News}/>
                <Route path="/home/profile" component={Profile}/>

                {/* TabBar */}
                <TabBar
                    tintColor="#21b97a"
                    barTintColor="white"
                    noRenderContent
                >
                    <TabBar.Item
                        title="首页"
                        key="Life"
                        icon={<i className="iconfont icon-ind" />}
                        selectedIcon={<i className="iconfont icon-ind" />}
                        selected={this.state.selectedTab === "/home/index"}
                        onPress={() => {
                            this.setState({
                                selectedTab: "/home/index",
                            });
                            this.props.history.push('/home/index');
                        }}
                    >
                    </TabBar.Item>
                    <TabBar.Item
                        icon={<i className="iconfont icon-findHouse" />}
                        selectedIcon={<i className="iconfont icon-findHouse" />}
                        title="找房"
                        key="Koubei"
                        selected={this.state.selectedTab === "/home/list"}
                        onPress={() => {
                            this.setState({
                                selectedTab: "/home/list",
                            });
                            this.props.history.push('/home/list');
                        }}
                    >
                    </TabBar.Item>
                    <TabBar.Item
                        icon={<i className="iconfont icon-infom" />}
                        selectedIcon={<i className="iconfont icon-infom" />}
                        title="资讯"
                        key="Friend"
                        selected={this.state.selectedTab === "/home/news"}
                        onPress={() => {
                            this.setState({
                                selectedTab: "/home/news",
                            });
                            this.props.history.push('/home/news');
                        }}
                    >
                    </TabBar.Item>
                    <TabBar.Item
                        icon={<i className="iconfont icon-my" />}
                        selectedIcon={<i className="iconfont icon-my" />}
                        title="我的"
                        key="my"
                        selected={this.state.selectedTab === "/home/profile"}
                        onPress={() => {
                            this.setState({
                                selectedTab: "/home/profile",
                            });
                            this.props.history.push('/home/profile');
                        }}
                    >
                    </TabBar.Item>
                </TabBar>
            </div>
        );
    }
}
