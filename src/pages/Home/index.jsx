import React, { Component } from "react";
import { Route } from "react-router-dom";
import { TabBar } from "antd-mobile";

// 首页
import Index from "../Index";
// 房列表
import HouseList from "../HouseList";
// 资讯
import News from "../News";
// 我的
import Profile from "../Profile";

import "./index.css";

const tabItems = [
    {
        title: "首页",
        icon: "icon-ind",
        path: "/home/index",
    },
    {
        title: "找房",
        icon: "icon-findHouse",
        path: "/home/list",
    },
    {
        title: "资讯",
        icon: "icon-infom",
        path: "/home/news",
    },
    {
        title: "我的",
        icon: "icon-my",
        path: "/home/profile",
    },
];

export default class Home extends Component {
    state = {
        selectedTab: this.props.location.pathname,
    };

    renderTabBarItem = () => {
        return tabItems.map(item =>
            <TabBar.Item
                title={item.title}
                key={item.title}
                icon={<i className={`iconfont ${item.icon}`} />}
                selectedIcon={<i className="iconfont icon-ind" />}
                selected={this.state.selectedTab === item.path}
                onPress={() => {
                    this.setState({
                        selectedTab: item.path,
                    });
                    this.props.history.push(item.path);
                }}
            />
        );
    };
    render() {
        return (
            <div className="home">
                {/* 二级路由出口在 Home 组件里 */}
                <Route path="/home/index" component={Index} />
                <Route path="/home/list" component={HouseList} />
                <Route path="/home/news" component={News} />
                <Route path="/home/profile" component={Profile} />

                {/* TabBar */}
                <TabBar
                    tintColor="#21b97a"
                    barTintColor="white"
                    noRenderContent
                >
                    {this.renderTabBarItem()}
                </TabBar>
            </div>
        );
    }
}
