import React from 'react';
import './index.less'
import { Link } from "react-router-dom";
import Axios from 'axios';
import { Form, Input, Button, Checkbox, Col, Row } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined} from '@ant-design/icons';

// const layout = {
//   labelCol: { span: 4 },
//   wrapperCol: { span: 20 },
// };
const tailLayout = {
  wrapperCol: { offset: 4, span: 20 },
};

export default class Choose extends React.Component {
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
  onKeyUp(event) {
	if(event.keyCode == 37) { //方向键 ← 
		console.log("会")
	} else if(event.keyCode == 39) { //方向键 →
		console.log("不会")
	}
  }
  onClick(direction) {
	if(direction == "left") { //方向键 ← 
		console.log("会")
	} else if(direction == "right") { //方向键 →
		console.log("不会")
	}
  }
  componentDidMount() {
	document.onkeyup = this.onKeyUp.bind(this);
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
      <div className="choose_wrapper">
        <div className="choose_header">
          <div className="choose_left">Chooser</div>
          <div className="choose_right">
            <Link to="/index">返回首页</Link>
          </div>
        </div>
        <div className="choose_content">
          <span className="word_phonetic_symbol">/draɪv/</span><br/>
		  <span className="word_text">drive</span><br/>
		  <span className="word_meaning">v. 驾驶;开车;驾车送(人);拥有(或驾驶)…汽车</span>
		  <br/>
		  <div className="button_content">
			<Button icon={<ArrowLeftOutlined />} shape="round" onClick={this.onClick.bind(this, "left")}>会</Button>
			<Button icon={<ArrowRightOutlined />} shape="round" onClick={this.onClick.bind(this, "right")}>不会</Button>
		  </div>
        </div>
      </div>
    );
  }
}
