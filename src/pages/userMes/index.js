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
        area: '',
        city: '',
        email: '',
        grade: '',
        latest_achievement: '',
        phone: '',
        province: '',
        qq_number: '',
        real_name: '',
        school: '',
        word_level: ''
    };
  }

  onArea(event) {
    this.setState({
        area: event.target.value
    });
  }

  onCity(event) {
    this.setState({
        city: event.target.value
    });
  }

  onEmail(event) {
    this.setState({
        email: event.target.value
    });
  }

  onGrade(event) {
    this.setState({
        grade: event.target.value
    });
  }

  onLatestAchievement(event) {
    this.setState({
        latest_achievement: event.target.value
    });
  }

  onPhone(event) {
    this.setState({
        phone: event.target.value
    });
  }

  onProvince(event) {
    this.setState({
        province: event.target.value
    });
  }

  onQQ(event) {
    this.setState({
        qq_number: event.target.value
    });
  }

  onReal(event) {
    this.setState({
        real_name: event.target.value
    });
  }

  onSchool(event) {
    console.log(this.state.school);
    this.setState({
        school: event.target.value
    });
  }

  onWord(event) {
    this.setState({
        word_level: event.target.value
    });
  }

  subFinish() {
    let values = {...this.state};
    values.latestAchievement = this.state.latest_achievement;
    values.qqNumber = this.state.qq_number;
    values.wordLevel = this.state.word_level;
    values.realName = this.state.real_name;
    delete values.real_name;
    delete values.word_level;
    delete values.latest_achievement;
    delete values.qq_number;
    console.log('Success:', values);
    HTTP.post("/api/profile", values).then(res => {
        message.success('设置成功!');
        window.location.href = `${baseUrl}/#/chooseStore`;
    }).catch(err => {
        message.error('设置失败!');
    });
  }

  subFinishFailed(errorInfo) {
    console.log('Failed:', errorInfo);
  }
  componentWillMount() {
    HTTP.get("/api/profile")
    .then(res => {
        console.log(res);
        if (res && res.data && res.data.msg) {
            this.setState({
                area: res.data.msg.area || '',
                city: res.data.msg.city || '',
                email: res.data.msg.email || '',
                grade: res.data.msg.grade || '',
                latest_achievement: res.data.msg.latest_achievement || '',
                phone: res.data.msg.phone || '',
                province: res.data.msg.province || '',
                qq_number: res.data.msg.qq_number || '',
                real_name: res.data.msg.real_name || '',
                school: res.data.msg.school || '',
                word_level: res.data.msg.word_level || ''
            });
        }
    }).catch(err => {
        message.error('个人信息获取失败!');
    });
  }

  componentDidMount() {
    
  }

  render() {
    const {area, city, email, grade, latest_achievement, phone, province, qq_number, real_name, school, word_level} = this.state;
    return (
      <div className="user_container">
        <Form
            {...layout}
            name="basic"
            initialValues={{
            remember: true,
            }}
        >
            <div className="content_left">
                <Form.Item
                    label="学校"
                    rules={[
                    {
                        required: true,
                        message: '请输入学校',
                    },
                    ]}
                >
                    <Input type="text" onChange={this.onSchool.bind(this)} value={school}/>
                </Form.Item>
                <Form.Item
                    label="年级"
                    rules={[
                    {
                        required: true,
                        message: '请输入学校',
                    },
                    ]}
                >
                    <Input type="text" onChange={this.onGrade.bind(this)} value={grade}/>
                </Form.Item>
                <Form.Item
                    label="得分"
                    rules={[
                    {
                        required: true,
                        message: '请输入得分',
                    },
                    ]}
                >
                    <Input type="text" onChange={this.onLatestAchievement.bind(this)} value={latest_achievement}/>
                </Form.Item>
            </div>
            <div className="content_right">
                <Form.Item
                    label="姓名"
                    rules={[
                    {
                        required: true,
                        message: '请输入姓名',
                    },
                    ]}
                >
                    <Input type="text" onChange={this.onReal.bind(this)} value={real_name}/>
                </Form.Item>
                <Form.Item
                    label="省份"
                    rules={[
                    {
                        required: true,
                        message: '请输入省份',
                    },
                    ]}
                >
                    <Input type="text" onChange={this.onProvince.bind(this)} value={province}/>
                </Form.Item>
                <Form.Item
                    label="市份"
                    rules={[
                    {
                        required: true,
                        message: '请输入市份',
                    },
                    ]}
                >
                    <Input type="text" onChange={this.onCity.bind(this)} value={city}/>
                </Form.Item>
                <Form.Item
                    label="区"
                    rules={[
                    {
                        required: true,
                        message: '请输入区',
                    },
                    ]}
                >
                    <Input type="text" onChange={this.onArea.bind(this)} value={area}/>
                </Form.Item>
                <Form.Item
                    label="手机号"
                    rules={[
                    {
                        required: true,
                        message: '请输入手机号',
                    },
                    ]}
                >
                    <Input type="text" onChange={this.onPhone.bind(this)} value={phone}/>
                </Form.Item>
                <Form.Item
                    label="QQ号"
                    rules={[
                    {
                        required: true,
                        message: '请输入QQ号',
                    },
                    ]}
                >
                    <Input type="text" onChange={this.onQQ.bind(this)} value={qq_number}/>
                </Form.Item>
                <div className="confirm">
                    <Button type="primary" htmlType="submit" size="large" block={true} onClick={this.subFinish.bind(this)}>
                        确认提交
                    </Button>
                </div>
            </div>
        </Form>
      </div>
    );
  }
}
