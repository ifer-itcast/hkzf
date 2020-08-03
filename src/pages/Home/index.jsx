import React, { Component } from "react";
import { Route } from "react-router-dom";
import { TabBar } from "antd-mobile";

import "./index.css";
export default class Home extends Component {
    state = {
        selectedTab: "redTab"
    };
    renderContent(pageText) {
        return <div>xxx</div>;
    }
    render() {
        return (
            <div className="home">
                {/* TabBar */}
                <TabBar
                    tintColor="#21b97a"
                    barTintColor="white"
                    hidden={this.state.hidden}
                >
                    <TabBar.Item
                        title="首页"
                        key="Life"
                        icon={<i className="iconfont icon-ind" />}
                        selectedIcon={<i className="iconfont icon-ind" />}
                        selected={this.state.selectedTab === "blueTab"}
                        onPress={() => {
                            this.setState({
                                selectedTab: "blueTab",
                            });
                        }}
                        data-seed="logId"
                    >
                        {this.renderContent("Life")}
                    </TabBar.Item>
                    <TabBar.Item
                        icon={<i className="iconfont icon-findHouse" />}
                        selectedIcon={<i className="iconfont icon-findHouse" />}
                        title="找房"
                        key="Koubei"
                        selected={this.state.selectedTab === "redTab"}
                        onPress={() => {
                            this.setState({
                                selectedTab: "redTab",
                            });
                        }}
                        data-seed="logId1"
                    >
                        {this.renderContent("Koubei")}
                    </TabBar.Item>
                    <TabBar.Item
                        icon={<i className="iconfont icon-infom" />}
                        selectedIcon={<i className="iconfont icon-infom" />}
                        title="资讯"
                        key="Friend"
                        selected={this.state.selectedTab === "greenTab"}
                        onPress={() => {
                            this.setState({
                                selectedTab: "greenTab",
                            });
                        }}
                    >
                        {this.renderContent("Friend")}
                    </TabBar.Item>
                    <TabBar.Item
                        icon={<i className="iconfont icon-my" />}
                        selectedIcon={<i className="iconfont icon-my" />}
                        title="我的"
                        key="my"
                        selected={this.state.selectedTab === "yellowTab"}
                        onPress={() => {
                            this.setState({
                                selectedTab: "yellowTab",
                            });
                        }}
                    >
                        {this.renderContent("My")}
                    </TabBar.Item>
                </TabBar>
            </div>
        );
    }
}
