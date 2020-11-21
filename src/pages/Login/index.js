import React from 'react';
import './index.less'
import {Link} from "react-router-dom";
import Axios from 'axios';
import { Button } from 'antd';
export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}

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
        <div>
          我是登录
          <br/>
          <br/>
          <Link to="/index">首页</Link>
          <Button type="primary">Button</Button>
        </div>
    );
  }
}
