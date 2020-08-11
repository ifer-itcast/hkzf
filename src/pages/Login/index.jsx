import React, { Component } from "react";
import { Flex, WingBlank, WhiteSpace, Toast } from "antd-mobile";
import { Link } from "react-router-dom";
import { API } from "../../utils";
import { withFormik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import NavHeader from "../../components/NavHeader";
import styles from "./index.module.css";

// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/;
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/;

class Login extends Component {
    render() {
        return (
            <div className={styles.root}>
                {/* 顶部导航 */}
                <NavHeader className={styles.navHeader}>账号登录</NavHeader>
                <WhiteSpace size="xl" />
                {/* 登录表单 */}
                <WingBlank>
                    <Form>
                        <div className={styles.formItem}>
                            <Field
                                className={styles.input}
                                name="username"
                                placeholder="请输入账号"
                            />
                        </div>
                        {
                            <ErrorMessage
                                className={styles.error}
                                name="username"
                                component="div"
                            />
                        }
                        <div className={styles.formItem}>
                            <Field
                                className={styles.input}
                                name="password"
                                placeholder="请输入密码"
                                type="password"
                            />
                        </div>
                        {
                            <ErrorMessage
                                className={styles.error}
                                name="password"
                                component="div"
                            />
                        }
                        <div className={styles.formSubmit}>
                            <button className={styles.submit} type="submit">
                                登 录
                            </button>
                        </div>
                    </Form>
                    <Flex className={styles.backHome}>
                        <Flex.Item>
                            <Link to="/registe">还没有账号，去注册~</Link>
                        </Flex.Item>
                    </Flex>
                </WingBlank>
            </div>
        );
    }
}

export default withFormik({
    mapPropsToValues: () => ({ username: "", password: "" }),
    validationSchema: Yup.object().shape({
        username: Yup.string()
            .required("账号为必填项")
            .matches(REG_UNAME, "长度为5到8位，只能出现数字、字母、下划线"),
        password: Yup.string()
            .required("密码为必填项")
            .matches(REG_PWD, "长度为5到12位，只能出现数字、字母、下划线"),
    }),
    handleSubmit: async (values, { props }) => {
        const { username, password } = values;
        const {
            data: { status, body, description },
        } = await API.post("/user/login", { username, password });
        if (status === 200) {
            // 登陆成功
            localStorage.setItem("hkzf_token", body.token);
            props.history.go(-1);
        } else {
            // 登陆失败，内容、持续时间、关闭后回调、是否显示透明蒙层
            Toast.info(description, 2, null, false);
        }
    },
})(Login);
