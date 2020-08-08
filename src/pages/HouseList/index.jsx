import React, { Component } from "react";
import { Flex } from "antd-mobile";
import { List } from "react-virtualized";
import HouseItem from "../../components/HouseItem";
import { API } from "../../utils/api";
import { BASE_URL } from "../../utils/url";
import SearchHeader from "../../components/SearchHeader";
import Filter from "./components/Filter";
import styles from "./index.module.css";

const { label, value } = JSON.parse(localStorage.getItem("hkzf_city"));

export default class HouseList extends Component {
    filters = {};
    state = {
        list: [],
        count: 0,
    };
    onFilter = filters => {
        this.filters = filters;
        this.onSearchHouseList();
    };
    async onSearchHouseList() {
        const { data } = await API.get("/houses", {
            params: {
                cityId: value,
                ...this.filters,
                start: 1,
                end: 20,
            },
        });
        const { list, count } = data.body;
        this.setState({
            list,
            count,
        });
    }
    componentDidMount() {
        this.onSearchHouseList();
    }
    renderHouseList = ({ key, index, style }) => {
        // 根据索引号来获取当前这一行的房屋数据
        const { list } = this.state;
        const house = list[index];
        return (
            <HouseItem
                key={key}
                style={style}
                src={BASE_URL + house.houseImg}
                title={house.title}
                desc={house.desc}
                tags={house.tags}
                price={house.price}
            />
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
                <Filter onFilter={this.onFilter} />
                {/* 房屋列表 */}
                <div className={styles.houseItems}>
                    <List
                        width={300}
                        height={300}
                        rowCount={this.state.count} // List列表项的行数
                        rowHeight={120} // 每一行的高度
                        rowRenderer={this.renderHouseList} // 渲染列表项中的每一行
                    />
                </div>
            </div>
        );
    }
}
