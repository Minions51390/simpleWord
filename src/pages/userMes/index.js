import React from 'react';
import './index.less'
import { Link } from "react-router-dom";
import HTTP from '../../utils/api.js';
import { Form, Input, Button, Checkbox, Col, Row, Radio } from 'antd';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const tailLayout = {
  wrapperCol: { offset: 4, span: 20 },
};

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  subFinish(values) {
    console.log('Success:', values);
    HTTP.post("/api/profile", values).then(res => {
      console.log("请求成功:", res.data);
    }).catch(err => {
      window.console.log('请求失败:', err);
    });
  }

  subFinishFailed(errorInfo) {
    console.log('Failed:', errorInfo);
  }

  componentDidMount() {
    HTTP.get("/api/profile")
    .then(res => {
        console.log("请求成功:", res.data);
    }).catch(err => {
        window.console.log('请求失败:', err);
    });
  }

  render() {
    return (
      <div className="user_container">
        <Form
            {...layout}
            name="basic"
            initialValues={{
            remember: true,
            }}
            onFinish={this.subFinish.bind(this)}
            onFinishFailed={this.subFinishFailed.bind(this)}
        >
            <div className="content_left">
                <Form.Item
                    label="学校"
                    name="school"
                    rules={[
                    {
                        required: true,
                        message: '请输入学校',
                    },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="年级"
                    name="grade"
                    rules={[
                    {
                        required: true,
                        message: '请输入学校',
                    },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="得分"
                    name="latestAchievement"
                    rules={[
                    {
                        required: true,
                        message: '请输入得分',
                    },
                    ]}
                >
                    <Input />
                </Form.Item>
            </div>
            <div className="content_right">
                <Form.Item
                    label="姓名"
                    name="realName"
                    rules={[
                    {
                        required: true,
                        message: '请输入姓名',
                    },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="省份"
                    name="province"
                    rules={[
                    {
                        required: true,
                        message: '请输入省份',
                    },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="市份"
                    name="city"
                    rules={[
                    {
                        required: true,
                        message: '请输入市份',
                    },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="区"
                    name="area"
                    rules={[
                    {
                        required: true,
                        message: '请输入区',
                    },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="手机号"
                    name="phone"
                    rules={[
                    {
                        required: true,
                        message: '请输入手机号',
                    },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="QQ号"
                    name="qqNumber"
                    rules={[
                    {
                        required: true,
                        message: '请输入QQ号',
                    },
                    ]}
                >
                    <Input />
                </Form.Item>
                <div className="confirm">
                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit" size="large" block={true}>
                            确认提交
                        </Button>
                    </Form.Item>
                </div>
            </div>
        </Form>
      </div>
    );
  }
}
