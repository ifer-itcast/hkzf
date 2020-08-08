import React, { Component } from "react";
import { Flex, Toast } from "antd-mobile";
import {
    List,
    WindowScroller,
    AutoSizer,
    InfiniteLoader,
} from "react-virtualized";
import HouseItem from "../../components/HouseItem";
import SearchHeader from "../../components/SearchHeader";
import Filter from "./components/Filter";
import Sticky from "../../components/Sticky";
import NoHouse from "../../components/NoHouse";
import { API } from "../../utils/api";
import { BASE_URL } from "../../utils/url";
import styles from "./index.module.css";

const { label, value } = JSON.parse(localStorage.getItem("hkzf_city"));

export default class HouseList extends Component {
    filters = {};
    state = {
        list: [],
        count: 0,
        isLoading: false, // 数据是否加载中，设置为 true 也 ok
    };
    onFilter = filters => {
        window.scrollTo(0, 0); // 每次搜索时，搜索结果都从最顶部显示
        this.filters = filters;
        this.onSearchHouseList();
    };
    async onSearchHouseList() {
        this.setState({ isLoading: true });
        Toast.loading("加载中...", 0, null, false);
        const { data } = await API.get("/houses", {
            params: {
                cityId: value,
                ...this.filters,
                start: 1,
                end: 20,
            },
        });
        const { list, count } = data.body;
        Toast.hide();
        if (count !== 0) {
            Toast.info(`共找到 ${count} 套房源`, 2, null, false);
        }
        this.setState({
            list,
            count,
            isLoading: false, // 数据是否加载中，否，加载完啦
        });
    }
    componentDidMount() {
        this.onSearchHouseList();
    }
    renderHouseList = ({ key, index, style }) => {
        // 根据索引号来获取当前这一行的房屋数据
        const { list } = this.state;
        const house = list[index];
        if (!house) {
            return (
                <div key={key} style={style}>
                    <p className={styles.loading} />
                </div>
            );
        }

        return (
            <HouseItem
                key={key}
                // 注意这里的style不要忘了在 Houseitem 中进行接受
                style={style}
                src={BASE_URL + house.houseImg}
                title={house.title}
                desc={house.desc}
                tags={house.tags}
                price={house.price}
            />
        );
    };
    // 判断列表中的每一行是否加载完成
    isRowLoaded = ({ index }) => {
        return !!this.state.list[index];
    };
    // 加载更多
    loadMoreRows = ({ startIndex, stopIndex }) => {
        return new Promise(resolve => {
            // 数据加载完成时调用 resolve 即可
            API.get("/houses", {
                params: {
                    cityId: value,
                    ...this.filters,
                    start: startIndex,
                    end: stopIndex,
                },
            }).then(res => {
                this.setState({
                    list: [...this.state.list, ...res.data.body.list],
                });
                resolve();
            });
        });
    };
    renderList = () => {
        const { count, isLoading } = this.state;
        // 核心：数据加载完成后再进行 count 的判断
        if (count === 0 && !isLoading) {
            return <NoHouse>没有找到房源，请您换个搜索条件吧~</NoHouse>;
        }
        // debugger;
        return (
            <InfiniteLoader
                isRowLoaded={this.isRowLoaded}
                loadMoreRows={this.loadMoreRows}
                rowCount={count}
            >
                {({ onRowsRendered, registerChild }) =>
                    <WindowScroller>
                        {({ height, isScrolling, scrollTop }) =>
                            <AutoSizer>
                                {({ width }) =>
                                    <List
                                        autoHeight // 设置高度为 WindowScroller 的高度
                                        width={width}
                                        height={height}
                                        rowCount={count} // List列表项的行数
                                        rowHeight={120} // 每一行的高度
                                        rowRenderer={this.renderHouseList} // 渲染列表项中的每一行
                                        isScrolling={isScrolling}
                                        scrollTop={scrollTop}
                                        onRowsRendered={onRowsRendered}
                                        registerChild={registerChild}
                                    />}
                            </AutoSizer>}
                    </WindowScroller>}
            </InfiniteLoader>
        );
    };
    render() {
        return (
            <div>
                <Flex className={styles.header}>
                    <i
                        className="iconfont icon-back"
                        onClick={() => this.props.history.go(-1)}
                    />
                    <SearchHeader
                        cityName={label}
                        className={styles.searchHeader}
                    />
                </Flex>
                <Sticky height={40}>
                    <Filter onFilter={this.onFilter} />
                </Sticky>
                {/* 房屋列表 */}
                <div className={styles.houseItems}>
                    {this.renderList()}
                </div>
            </div>
        );
    }
}
