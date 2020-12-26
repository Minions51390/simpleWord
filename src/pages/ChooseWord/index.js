import React from 'react';
import './index.less'
import { Link } from "react-router-dom";
import Axios from 'axios';
import { Form, Input, Button, Checkbox, Col, Row, Progress } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined} from '@ant-design/icons';
// import getQueryString from ''
import {getQueryString} from '../../utils/stringUtils';
import HTTP from '../../utils/api.js';
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
     "phoneticSymbols": "音频",
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
      "phoneticSymbols": "/draɪv/",
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
    "phoneticSymbols": "音频",
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
//  {            
//   id: 1
//   meaning: "vt.放弃,遗弃;n.放任,狂热"
//   phoneticSymbols: ""
//   text: "abandon"
//  }
]
export default class Choose extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wordList: [],
      currentWord: {
        wordIndex: 0,
      },
      currentWordIndex: 0,
      whichKeyDown: null,
      whichKeyUp: null,
      isFinish: false,
      isCurrentWordStrange: null,
    };
    this.recordWordList = [];
    this.wordLibName = null
    this.wordLibId = null
  }


  componentWillMount() {
    this.wordLibName = getQueryString('lib_name')
    this.wordLibId = parseInt(getQueryString('lib_id'))
    this.loadWordLib(this.wordLibName, this.wordLibId)
  }

  loadWordLib(wordLibName, wordLibId) {
    HTTP.get("/api/libWords",{
      params: {
        wordLibId
      }
    }).then(res => {
      console.log("请求成功:", res.data);
      var wordList = res.data.data.wordList
      wordList.length = 20
      this.setState({
        wordList: wordList || [],
        
      });
    }).catch(err => {
      console.log("请求失败:", err);
    });
  }

  postStrangeWordList() {
    let values = {};
    values.wordLibName = this.wordLibName;
    values.wordLibId = this.wordLibId;
    values.strangeWordList = this.recordWordList;
    console.log('Success:', JSON.stringify(values) );
    HTTP.post("/api/libWords",values).then(res => {
      console.log("请求成功:", res);
      
    }).catch(err => {
      console.log("请求失败:", err);
    });
  }

  onFinish(values) {
    console.log('Success:', values);
  }

  onFinishFailed(errorInfo) {
    console.log('Failed:', errorInfo);
  }
  onKeyDown(event) {
    const {isCurrentWordStrange} = this.state;
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
    } else if(event.keyCode == 32) { //空格键
      if (isCurrentWordStrange == null) {
        return
      }
      this.setState({
        whichKeyUp: null,
        whichKeyDown: 'space'
      });
    }
  }

  onKeyUp(event) {
    const {currentWordIndex, wordList, isCurrentWordStrange, isFinish} = this.state;
    if(event.keyCode == 37) { //方向键 ← 
      this.setState({
        whichKeyUp: 'left',
        isCurrentWordStrange: false
      });
    } else if(event.keyCode == 39) { //方向键 →
      this.setState({
        whichKeyUp: 'right',
        isCurrentWordStrange: true
      });
    } else if(event.keyCode == 32) { //空格键
      if (isFinish) {
        this.postStrangeWordList()
        this.setState({
          whichKeyDown: null,
          whichKeyUp: 'space',
        });
      } else {
        if (isCurrentWordStrange == null) {
          return
        }
        if (isCurrentWordStrange) {
          this.recordResult(wordList[currentWordIndex].id)
        }
        this.goNext()
        this.setState({
          whichKeyDown: null,
          whichKeyUp: 'space',
          isCurrentWordStrange: null
        });
      }
      
    }
  }
  onClick(item) {
    const {currentWordIndex, wordList, isCurrentWordStrange, isFinish} = this.state;
    if(item == "left") {
      console.log("会")
      this.setState({
        whichKeyUp: 'left',
        isCurrentWordStrange: false
      });
    } else if(item == "right") {
      console.log("不会")
      this.setState({
        whichKeyUp: 'right',
        isCurrentWordStrange: true
      });
    } else if(item == "space") { //空格键
      if (isFinish) {
        this.postStrangeWordList()
        this.setState({
          whichKeyDown: null,
          whichKeyUp: 'space'
        });
      } else {
        if (isCurrentWordStrange == null) {
          return
        }
        if (isCurrentWordStrange) {
          this.recordResult(wordList[currentWordIndex].id)
        }
        this.goNext()
        this.setState({
          whichKeyDown: null,
          whichKeyUp: 'space',
          isCurrentWordStrange: null
        });
      }
      
    }
  }

  recordResult(wordid){
    this.recordWordList.push(
      wordid
    )
    console.log("recordResult" , this.recordWordList)
  }

  goNext() {
    if(this.state.currentWordIndex + 1 < this.state.wordList.length) {
      this.setState({
        currentWordIndex: this.state.currentWordIndex + 1
      });
    } else {
      this.setState({
        isFinish: true
      });
    }
  }

  componentDidMount() {
    document.onkeyup = this.onKeyUp.bind(this);
    document.onkeydown = this.onKeyDown.bind(this);
  }

  render() {
    const {currentWordIndex, whichKeyDown, whichKeyUp, wordList, isFinish} = this.state;
    return (
      <div className="choose_wrapper">
        <div className="choose_header">
          <div className="choose_left">Chooser</div>
          <div className="choose_right">
            <Link to="/index">返回首页</Link>
          </div>
        </div>
        {wordList.length != 0 && 
          <div className="choose_content">
            <span className="word_phonetic_symbol">{isFinish ? '/səkˈses/' : wordList[currentWordIndex].phoneticSymbols}</span><br/>
            <span className="word_text">{isFinish ? 'success' : wordList[currentWordIndex].text}</span><br/>
            <span className="word_meaning">{isFinish ? 'n. 成功; 胜利; 发财; 成名; 成功的人(或事物)' : wordList[currentWordIndex].meaning}</span>
            <br/>
            {isFinish ? 
              <div className="button_content_mid">
                <Button className={whichKeyDown == 'space' ? "style_button" : null }  shape="round" onClick={this.onClick.bind(this, "space")}>space  完成
                <div className={whichKeyUp == 'space' ? "click-animating-node" : null }></div></Button>  
              </div>
            :
              <div className="button_content_space_between">
                <Button className={whichKeyDown == 'left' ? "style_button" : null } icon={<ArrowLeftOutlined />} shape="round" onClick={this.onClick.bind(this, "left")}>会
                <div className={whichKeyUp == 'left' ? "click-animating-node" : null }></div></Button>
                
                <Button className={whichKeyDown == 'space' ? "style_button" : null } shape="round" onClick={this.onClick.bind(this, "space")}>space  确定
                <div className={whichKeyUp == 'space' ? "click-animating-node" : null }></div></Button>  
              
                <Button className={whichKeyDown == 'right' ? "style_button" : null } icon={<ArrowRightOutlined />} shape="round" onClick={this.onClick.bind(this, "right")}>不会
                <div className={whichKeyUp == 'right' ? "click-animating-node" : null }></div></Button>
              </div>
            }
          </div>
        }
        <div className="progress_content">
        <span className="progress_text">{`${currentWordIndex + 1} / ${wordList.length}`}</span>
        </div>
        
      </div>
    );
  }
}