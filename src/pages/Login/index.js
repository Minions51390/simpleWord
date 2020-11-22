import React from 'react';
import './index.less'
import { Link } from "react-router-dom";
import Axios from 'axios';
import { Form, Input, Button, Checkbox, Col, Row } from 'antd';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    
    };
  }

  onFinish(values) {
    console.log('Success:', values);
  }

  onFinishFailed(errorInfo) {
    console.log('Failed:', errorInfo);
  }

  componentDidMount() {
    Axios.get("http://wthrcdn.etouch.cn/weather_mini?citykey=101010100")
    .then(res => {
      console.log("请求成功:", res.data);
    })
    .catch(err => {
      window.console.log('请求失败:', err);
    });
  }

  render() {
    return (
      <div className="login_wrapper">
        <div className="login_header">
          <div className="login_left">Register</div>
          <div className="login_right"></div>
        </div>
        <div className="login_content">
          <Form
            {...layout}
            name="basic"
            initialValues={{
              remember: true,
            }}
            onFinish={this.onFinish.bind(this)}
            onFinishFailed={this.onFinishFailed.bind(this)}
          >
            <Form.Item
              label="用户名"
              name="username"
              rules={[
                {
                  required: true,
                  message: '请输入用户名',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[
                {
                  required: true,
                  message: '请输入密码',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="邮箱"
              name="email"
              rules={[
                {
                  required: true,
                  message: '请输入邮箱',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="验证码">
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item
                    name="captcha"
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: '请输入邮箱中的验证码',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Button>获取验证码</Button>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item
              label="邀请码"
              name="inviteCode"
              rules={[
                {
                  required: true,
                  message: '请输入邀请码',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                登录
              </Button>
            </Form.Item>
          </Form>
          {/* <Link to="/index">首页</Link> */}
        </div>
      </div>
    );
  }
}
