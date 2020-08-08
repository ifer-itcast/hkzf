import React, { Component } from "react";
import { Flex } from "antd-mobile";
import { API } from "../../utils/api";
import SearchHeader from "../../components/SearchHeader";
import Filter from "./components/Filter";
import styles from "./index.module.css";

const { label } = JSON.parse(localStorage.getItem("hkzf_city"));

export default class HouseList extends Component {
    onFilter = filters => {
        this.filters = filters;
        this.onSearchHouseList();
    };
    async onSearchHouseList() {
        const { value } = JSON.parse(localStorage.getItem("hkzf_city"));
        const { data } = await API.get("/houses", {
            params: {
                cityId: value,
                ...this.filters,
                start: 1,
                end: 20,
            },
        });
        console.log(data);
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
