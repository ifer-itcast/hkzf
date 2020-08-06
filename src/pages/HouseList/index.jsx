import React, { Component } from "react";
import { Flex } from 'antd-mobile';
import SearchHeader from "../../components/SearchHeader";
import styles from './index.module.css';

const { label } = JSON.parse(localStorage.getItem("hkzf_city"));

export default class HouseList extends Component {
    render() {
        return (
            <div>
                <Flex className={styles.header}>
                    <i className="iconfont icon-back" />
                    <SearchHeader
                        cityName={label}
                        className={styles.searchHeader}
                    />
                </Flex>
            </div>
        );
    }
}
