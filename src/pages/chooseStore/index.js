import React from 'react';
import './index.less'
import { Link } from "react-router-dom";
import HTTP from '../../utils/api.js';
import { Form, Input, Button, Checkbox, Col, Row, Radio, Drawer, message } from 'antd';
import { PickerView, WhiteSpace } from 'antd-mobile';
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
      myStore: [
        {
          label: 'GET1',
          value: 'GET1',
        },
        {
          label: 'GET2',
          value: 'GET2',
        },
        {
          label: 'GET3',
          value: 'GET3',
        },
        {
          label: 'GET4',
          value: 'GET4',
        },
        {
          label: 'GET5',
          value: 'GET5',
        },
        {
          label: 'GET6',
          value: 'GET6',
        },
        {
          label: 'GET7',
          value: 'GET7',
        },
        {
          label: 'GET8',
          value: 'GET8',
        },
        {
          label: 'GET9',
          value: 'GET9',
        },
        {
          label: 'GET10',
          value: 'GET10',
        },
        {
          label: 'GET11',
          value: 'GET11',
        },
        {
          label: 'GET12',
          value: 'GET12',
        },
        {
          label: 'GET13',
          value: 'GET13',
        },
        {
          label: 'GET14',
          value: 'GET14',
        },
        {
          label: 'GET15',
          value: 'GET15',
        },
        {
          label: 'GET16',
          value: 'GET16',
        },
        {
          label: 'GET17',
          value: 'GET17',
        },
        {
          label: 'GET18',
          value: 'GET18',
        },
        {
          label: 'GET19',
          value: 'GET19',
        },
        {
          label: 'GET20',
          value: 'GET20',
        },
      ],
      wordLibs: [],
      value: ['GET1'],
      lib_name: '',
      lib_id: '',
      count: '',
      visible: false,
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
  onChange(value) {
    const wordLibs = this.state.wordLibs;
    console.log(value);
    this.setState({
      value: value
    });
    wordLibs.map((val) => {
      if (val.lib_name === value[0]) {
        console.log(val.lib_id);
        this.setState({
          lib_id: val.lib_id
        });
      }
    });
  }
  submitStore() {
    console.log(this.state.value);
  }
  showDrawer() {
    this.setState({
      visible: true
    });
  };

  onClose() {
    this.setState({
      visible: false
    });
  };

  componentWillMount() {
    HTTP.get("/api/profile")
    .then(res => {
      console.log("请求成功:", res.data);
      if (!(res && res.data && res.data.msg && res.data.msg.email)) {
        location.href = `${baseUrl}/#/login`;
      }
      if (!(res && res.data && res.data.msg && res.data.msg.grade)) {
        this.setState({
          visible: true
        });
      }
      this.setState({
        area: res.data.msg.area || '暂无',
        city: res.data.msg.city || '暂无',
        email: res.data.msg.email || '暂无',
        grade: res.data.msg.grade || '暂无',
        latest_achievement: res.data.msg.latest_achievement || '暂无',
        phone: res.data.msg.phone || '暂无',
        province: res.data.msg.province || '暂无',
        qq_number: res.data.msg.qq_number || '暂无',
        real_name: res.data.msg.real_name || '暂无',
        school: res.data.msg.school || '暂无',
        word_level: res.data.msg.word_level || '暂无'
      });
    }).catch(err => {
        location.href = `${baseUrl}/#/login`;
    });
    HTTP.get("/api/libList", {
      params: {
        userName: 'minions'
      }
    }).then(res => {
      let arr = res.data.msg.wordLibs.map((val) => {
        return {
          label: val.lib_name,
          value: val.lib_name
        };
      });
      this.setState({
        wordLibs: res.data.msg.wordLibs,
        value: [res.data.msg.wordLibs[0].lib_name],
        lib_id: res.data.msg.wordLibs[0].lib_id,
        myStore: arr
      });

      console.log(res);
    }).catch(err => {
      console.log(err);
    });
  }

  componentDidMount() {
    
  }

  render() {
    const {myStore, value, visible, area, city, email, grade, latest_achievement, phone, province, qq_number, real_name, school, word_level, lib_id} = this.state;
    return (
      <div className="store_container">
        <div className="store_left">
          <PickerView
            onChange={this.onChange.bind(this)}
            value={this.state.value}
            data={myStore}
            cascade={false}
          />
          <div className="confirm">
            <Button type="primary" htmlType="submit" size="large" block={true} onClick={this.submitStore.bind(this)}>
              <Link to={`/chooseWord?lib_name=${value[0]}&lib_id=${lib_id}`}>确认词库</Link>
            </Button>
            <WhiteSpace /><WhiteSpace />
            <Button type="primary" htmlType="submit" size="large" block={true} onClick={this.showDrawer.bind(this)}>
                查看信息
            </Button>
          </div>
        </div>
        <div className="store_right">
          
        </div>
        <Drawer
          title="个人信息"
          placement="right"
          closable={false}
          onClose={this.onClose.bind(this)}
          visible={visible}
        >
          <p>姓名：{real_name}</p>
          <p>省份：{province}</p>
          <p>市份：{city}</p>
          <p>区：{area}</p>
          <p>手机号：{phone}</p>
          <p>邮箱：{email}</p>
          <p>QQ号：{qq_number}</p>
          <p>学校：{school}</p>
          <p>年级：{grade}</p>
          <p>得分：{latest_achievement}</p>
          <div className="jumpBtn">
            <Button type="primary" htmlType="submit" size="large" block={true}>
              <Link to="/userMes">个人中心</Link>
            </Button>
          </div>
        </Drawer>
      </div>
    );
  }
}
