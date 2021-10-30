import React from 'react';
import './index.less'
import { Link } from "react-router-dom";
import HTTP from '../../utils/api.js';
import { Form, Input, Button, Checkbox, Col, Row, Radio, message } from 'antd';
import baseUrl from '../../utils/config.js';

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
      mode: 'login',
      email: ''
    };
  }

  handleModeChange(e) {
    const mode = e.target.value;
    this.setState({ mode });
  };

  registerFinish(values) {
    console.log('Success:', values);
    HTTP.post("/auth/register", values).then(res => {
      message.success('注册成功!');
      window.location.href = `${baseUrl}/#/chooseStore`;
    }).catch(err => {
      message.error('注册失败!');
    });
  }

  registerFinishFailed(errorInfo) {
    message.error(errorInfo.errorFields[0].errors[0]);
  }

  loginFinish(values) {
    console.log('Success:', values);
    HTTP.post("/auth/login", values).then(res => {
      message.success('登录成功!');
      // window.location.href = res.data.data;
    }).catch(err => {
      message.error('登录失败!');
    });
  }

  loginFinishFailed(errorInfo) {
    message.error(errorInfo.errorFields[0].errors[0]);
  }

  sendEmail() {
    HTTP.post("/auth/email", {
      email: this.state.email
    }).then(res => {
      message.success('验证码发送成功!');
    }).catch(err => {
      message.error('验证码发送失败!');
    });
  }

  onInputEmail(event) {
    this.setState({
      email: event.target.value
    });
  }

  componentDidMount() {
    
  }

  render() {
    const { mode, email } = this.state;
    return (
      <div className="main_container">
        <div className="page_header">
          <div className="page_left">
          <Radio.Group onChange={this.handleModeChange.bind(this)} value={mode} style={{ marginBottom: 8 }}>
            <Radio.Button value="register">注册</Radio.Button>
            <Radio.Button value="login">登录</Radio.Button>
          </Radio.Group>
          </div>
          <div className="page_right">
            {/* <Link to="/index">返回首页</Link> */}
          </div>
        </div>
        {
          mode === 'register'
          ?
          (<div className="register_content">
            <Form
              {...layout}
              name="basic"
              initialValues={{
                remember: true,
              }}
              onFinish={this.registerFinish.bind(this)}
              onFinishFailed={this.registerFinishFailed.bind(this)}
            >
              <Form.Item
                label="用户名"
                name="userName"
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
                <Input type="text" onChange={this.onInputEmail.bind(this)} value={email}/>
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
                    <Button onClick={this.sendEmail.bind(this)}>获取验证码</Button>
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
                  注册
                </Button>
              </Form.Item>
            </Form>
          </div>)
          :
          <div className="login_content">
            <Form
              {...layout}
              name="basic"
              initialValues={{
                remember: true,
              }}
              onFinish={this.loginFinish.bind(this)}
              onFinishFailed={this.loginFinishFailed.bind(this)}
            >
              <Form.Item
                label="用户名"
                name="userName"
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
              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                  登录
                </Button>
              </Form.Item>
            </Form>
          </div>
        }
        
      </div>
    );
  }
}
