import React from 'react';
import './index.less'
import { Link } from "react-router-dom";
import HTTP from '../../utils/api.js';
import { Form, Input, Button, Checkbox, Col, Row, Radio, Drawer } from 'antd';
import { PickerView, WhiteSpace } from 'antd-mobile';

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
      chooseStore: '',
      visible: false
    };
  }
  onChange(chooseStore) {
    console.log(chooseStore);
  }
  submitStore() {
    console.log(this.state.chooseStore);
  }
  showDrawer() {
    this.setState({
      visible: true
    });
  };

  onClose() {
    this.setState({
      visible: false
    })
  };
  componentDidMount() {
    HTTP.get("/api/profile")
    .then(res => {
        console.log("请求成功:", res.data);
    }).catch(err => {
        window.console.log('请求失败:', err);
    });
  }

  render() {
    const {myStore, chooseStore, visible} = this.state;
    return (
      <div className="store_container">
        <div className="store_left">
          <PickerView
            onChange={this.onChange.bind(this)}
            data={myStore}
            cascade={false}
          />
          <div className="confirm">
            <Button type="primary" htmlType="submit" size="large" block={true} onClick={this.submitStore.bind(this)}>
                确认词库
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
          <p>姓名：啊啊啊</p>
          <p>年级：大三</p>
          <p>分数：100</p>
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
