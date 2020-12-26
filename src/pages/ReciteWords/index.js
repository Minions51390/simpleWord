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
export default class ReciteWords extends React.Component {
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
      singleWordTimes:0,
      singleWordMeaningIsVisible: false,
    };
    this.recordWordList = [];
    this.wordLibName = null
    this.wordLibId = null
    this.dateIndex = null
    this.audioControler = null
  }

  componentWillMount() {
    this.wordLibName = getQueryString('lib_name')
    this.wordLibId = parseInt(getQueryString('lib_id'))
    this.loadWordLib()
  }

  componentDidMount() {
    // this.audioControler = document.getElementById('audioControler');
  }

  loadWordLib() {
    HTTP.get("/api/recite").then(res => {
      console.log("请求成功:", res.data);
      var wordList = res.data.data.wordList
    //   wordList.length = 20
      this.setState({
        wordList: wordList || [],
	  });
	  this.dateIndex = res.data.data.dateIndex
    }).catch(err => {
      console.log("请求失败:", err);
    });
  }

  postStrangeWordList() {
    const {isFinish} = this.state;
    let values = {};
    values.dateIndex = this.dateIndex;
    values.isFinish = isFinish;
    console.log('Success:', JSON.stringify(values) );
    HTTP.patch("/api/recite",values).then(res => {
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
    if(event.keyCode == 32) { //空格键
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
    if(this.audioControler != null && this.audioControler.paused == false){
      return
    }
    
    const {currentWordIndex, wordList, isCurrentWordStrange, isFinish} = this.state;
    if(event.keyCode == 32) { //空格键
      if (isFinish) {
        this.postStrangeWordList()
        this.setState({
          whichKeyDown: null,
          whichKeyUp: 'space',
        });
      } else {
        this.onSpaceKeyUp()
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

  onSpaceKeyUp() {
    if(this.state.singleWordTimes == 3) {
      this.goNext()
    } else {
      this.goSingleNextTime();
    }
    if(this.state.singleWordTimes %2 ==0) {
      this.setState({
        singleWordMeaningIsVisible: false,
      })
    } else {
      this.setState({
        singleWordMeaningIsVisible: true,
      })
    }
    this.playTts();
  }

  playTts() {
    if(this.audioControler == null){
      return
    }
    if(this.audioControler.paused){
      this.audioControler.play()// 播放
    }
  }
  

  goSingleNextTime() {
    
    
    this.setState({
      singleWordTimes: this.state.singleWordTimes + 1,
    })
  }

  goNext() {
    this.setState({
      singleWordTimes: 0,
    })
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
    const {currentWordIndex, whichKeyDown, whichKeyUp, wordList, isFinish, singleWordMeaningIsVisible} = this.state;
    return (
      <div className="choose_wrapper">
        <div className="choose_header">
          <div className="choose_left">ReciteWords</div>
          <div className="choose_right">
            <Link to="/index">返回首页</Link>
          </div>
        </div>
        {wordList.length != 0 && 
          <div className="choose_content">
            {/* <span className="word_phonetic_symbol">{isFinish ? '/səkˈses/' : wordList[currentWordIndex].phoneticSymbols}</span><br/> */}
            <span className="word_phonetic_symbol">{'/səkˈses/'}</span><br/>
            <span className="word_text">{isFinish ? 'success' : wordList[currentWordIndex].text}</span><br/>
            <div className="word_meaning_wrapper">
              {singleWordMeaningIsVisible &&
                <span className="word_meaning">{isFinish ? 'n. 成功; 胜利; 发财; 成名; 成功的人(或事物)' : wordList[currentWordIndex].meaning}</span>
              }
            </div>
            <br/>
            {!isFinish &&
              <audio ref={(audio) => { this.audioControler = audio; }} id="audioControler" controls="controls" hidden autoPlay src={`http://47.107.238.126/static/tts/${wordList[currentWordIndex].tts}`}></audio>
            }
            {isFinish &&
              <div className="button_content_mid">
                <Button className={whichKeyDown == 'space' ? "style_button" : null }  shape="round" onClick={this.onClick.bind(this, "space")}>space  完成
                <div className={whichKeyUp == 'space' ? "click-animating-node" : null }></div></Button>  
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
