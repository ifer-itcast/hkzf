import React, { Component } from "react";

import FilterFooter from "../../../../components/FilterFooter";

import styles from "./index.module.css";

export default class FilterMore extends Component {
    state = {
        selectedValues: this.props.defaultValue,
    };
    onTagClick = value => {
        const { selectedValues } = this.state;
        const newSelectedValues = [...selectedValues];
        if (selectedValues.indexOf(value) === -1) {
            // 无当前项
            newSelectedValues.push(value);
        } else {
            const index = newSelectedValues.findIndex(item => item === value);
            newSelectedValues.splice(index, 1);
        }
        this.setState({ selectedValues: newSelectedValues });
    };
    // 渲染标签
    renderFilters = data => {
        const { selectedValues } = this.state;
        // 高亮类名： styles.tagActive
        return data.map(item => {
            const isSelected = selectedValues.indexOf(item.value) !== -1;
            return (
                <span
                    onClick={() => this.onTagClick(item.value)}
                    key={item.value}
                    className={[
                        styles.tag,
                        isSelected ? styles.tagActive : "",
                    ].join(" ")}
                >
                    {item.label}
                </span>
            );
        });
    };
    onCancel = () => {
        // 注意这里清除的只是当前组件的数据，父组件的数据并没有清除，这正是我们期望的
        // 这也是为什么给自己组件加 selectedValues 的作用，方便处理自己的状态
        this.setState({
            selectedValues: [],
        });
    };
    onOk = () => {
        const { type, onSave } = this.props;
        onSave(type, this.state.selectedValues);
    };
    render() {
        const {
            data: { roomType, oriented, floor, characteristic },
            onCancel,
            type
        } = this.props;
        return (
            <div className={styles.root}>
                {/* 遮罩层 */}
                <div className={styles.mask} onClick={() => onCancel(type)} />

                {/* 条件内容 */}
                <div className={styles.tags}>
                    <dl className={styles.dl}>
                        <dt className={styles.dt}>户型</dt>
                        <dd className={styles.dd}>
                            {this.renderFilters(roomType)}
                        </dd>

                        <dt className={styles.dt}>朝向</dt>
                        <dd className={styles.dd}>
                            {this.renderFilters(oriented)}
                        </dd>

                        <dt className={styles.dt}>楼层</dt>
                        <dd className={styles.dd}>
                            {this.renderFilters(floor)}
                        </dd>

                        <dt className={styles.dt}>房屋亮点</dt>
                        <dd className={styles.dd}>
                            {this.renderFilters(characteristic)}
                        </dd>
                    </dl>
                </div>

                {/* 底部按钮 */}
                <FilterFooter
                    className={styles.footer}
                    cancelText="清除"
                    onCancel={this.onCancel}
                    onOk={this.onOk}
                />
            </div>
        );
    }
}
