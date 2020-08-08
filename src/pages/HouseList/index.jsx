import React, { Component } from "react";
import { Flex } from "antd-mobile";
import { API } from "../../utils/api";
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
            </div>
        );
    }
}
