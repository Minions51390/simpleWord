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
const wordList = [
  {            
     "id": 1,
     "text": "good",
     "phoneticSymbols": "音标",
     "partOfSpeech": "adj",
     "meaning": "好的牛逼",
   },
  {            
     "id": 2,
     "text": "fine",
     "pronunciation": "音频",
     "partOfSpeech": "adv",
     "meaning": "针不戳",
  },
  {            
    "id": 3,
    "text": "check",
    "phoneticSymbols": "音标",
    "partOfSpeech": "v",
    "meaning": "检查",
  },
  {            
      "id": 4,
      "text": "drive",
      "pronunciation": "/draɪv/",
      "partOfSpeech": "v",
      "meaning": "驾驶;开车;驾车送(人);拥有(或驾驶)…汽车",
  },
  {            
    "id": 1,
    "text": "good",
    "phoneticSymbols": "音标",
    "partOfSpeech": "adj",
    "meaning": "好的牛逼",
  },
 {            
    "id": 2,
    "text": "fine",
    "pronunciation": "音频",
    "partOfSpeech": "adv",
    "meaning": "针不戳",
 },
 {            
   "id": 3,
   "text": "check",
   "phoneticSymbols": "音标",
   "partOfSpeech": "v",
   "meaning": "检查",
 },
 {            
     "id": 4,
     "text": "drive",
     "pronunciation": "/draɪv/",
     "partOfSpeech": "v",
     "meaning": "驾驶;开车;驾车送(人);拥有(或驾驶)…汽车",
 }
]
export default class Choose extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentWord: {
        wordIndex: 0,
      },
      currentWordIndex: 0,
      whichKeyDown: null,
      whichKeyUp: null
    };
  }

  onFinish(values) {
    console.log('Success:', values);
  }

  onFinishFailed(errorInfo) {
    console.log('Failed:', errorInfo);
  }
  onKeyDown(event) {
    if(event.keyCode == 37) { //方向键 ← 
      this.setState({
        whichKeyUp: null,
        whichKeyDown: 'left'
      });
    } else if(event.keyCode == 39) { //方向键 →
      this.setState({
        whichKeyUp: null,
        whichKeyDown: 'right'
      });
    }
  }
  onKeyUp(event) {
    if(event.keyCode == 37) { //方向键 ← 
      this.goNext(true)
      this.setState({
        whichKeyDown: null,
        whichKeyUp: 'left'
      });
      // if(this.state.whichKeyDown == 'left') {
        
      // }
    } else if(event.keyCode == 39) { //方向键 →
      console.log("不会")
      this.goNext(false)
      this.setState({
        whichKeyDown: null,
        whichKeyUp: 'right'
      });
      // if(this.state.whichKeyDown == 'right') {
        
      // }
    }
  }
  onClick(direction) {
    if(direction == "left") { 
      this.goNext(true)
      this.setState({
        whichKeyDown: null,
        whichKeyUp: 'left'
      });
    } else if(direction == "right") {
      this.goNext(false)
      this.setState({
        whichKeyDown: null,
        whichKeyUp: 'right'
      });
    }
  }

  recordResult(){

  }

  goNext() {
    if(this.state.currentWordIndex < wordList.length - 1) {
      this.setState({
        currentWordIndex: this.state.currentWordIndex + 1
      });
    }
  }
  componentDidMount() {
	document.onkeyup = this.onKeyUp.bind(this);
	document.onkeydown = this.onKeyDown.bind(this);
    Axios.get("http://wthrcdn.etouch.cn/weather_mini?citykey=101010100")
    .then(res => {
      console.log("请求成功:", res.data);
    })
    .catch(err => {
      window.console.log('请求失败:', err);
    });
  }

  render() {
    const {currentWordIndex, whichKeyDown, whichKeyUp} = this.state;
    return (
      <div className="choose_wrapper">
        <div className="choose_header">
          <div className="choose_left">Chooser</div>
          <div className="choose_right">
            <Link to="/index">返回首页</Link>
          </div>
        </div>
        <div className="choose_content">
          <span className="word_phonetic_symbol">{wordList[currentWordIndex].phoneticSymbols}</span><br/>
		  <span className="word_text">{wordList[currentWordIndex].text}</span><br/>
		  <span className="word_meaning">{`${wordList[currentWordIndex].partOfSpeech}. ${wordList[currentWordIndex].meaning}`}</span>
		  <br/>
		  <div className="button_content">
        <Button className={whichKeyDown == 'left' ? "style_button" : null } icon={<ArrowLeftOutlined />} shape="round" onClick={this.onClick.bind(this, "left")}>会
        <div className={whichKeyUp == 'left' ? "click-animating-node" : null }></div></Button>
        
        <Button className={whichKeyDown == 'right' ? "style_button" : null } icon={<ArrowRightOutlined />} shape="round" onClick={this.onClick.bind(this, "right")}>不会
        <div className={whichKeyUp == 'right' ? "click-animating-node" : null }></div></Button>
		  </div>
        </div>
      </div>
    );
  }
}
