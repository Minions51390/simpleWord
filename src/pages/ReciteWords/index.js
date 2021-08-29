import React from 'react';
import './index.less'
import { Link } from "react-router-dom";
import Axios from 'axios';
import { Form, Input, Button, Checkbox, Col, Row, Progress, message} from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined} from '@ant-design/icons';
// import getQueryString from ''
import {getQueryString} from '../../utils/stringUtils';
import HTTP from '../../utils/api.js';

import promise from '../home/assets/promise.png';
import whiteBookBg from '../../assets/whiteBookBg.png';
import backIcon from '../../assets/backIcon.png';
import spaceIcon from '../../assets/spaceIcon.png';
import audioIcon from './assets/audioIcon.png';
import baseUrl from '../../utils/config.js';
// const layout = {
//   labelCol: { span: 4 },
//   wrapperCol: { span: 20 },
// };
const tailLayout = {
  wrapperCol: { offset: 4, span: 20 },
};
export default class ReciteWords extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wordList: [],
      currentWord: {
        wordIndex: 0,
      },
      count: 0,
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
    // this.wordLibId = null
    this.dateIndex = null
    this.audioControler = null
    this.startTime = null
    this.finishTime = null
    this.newWordsCount = null
    this.uniqwordList = []
    this.postStrangeWordListLock = false
  }

  componentWillMount() {
    var url = window.location.href.split('#')[0];
    if (url != document.referrer) {
      window.location.href = `${baseUrl}/#/Transfer`;
      window.location.reload()
    }
    this.wordLibName = getQueryString('lib_name')
    // this.wordLibId = parseInt(getQueryString('lib_id'))
    this.loadWordLib()
  }

  
  componentDidMount() {
    document.onkeyup = this.onKeyUp.bind(this);
    document.onkeydown = this.onKeyDown.bind(this);
  }

  loadWordLib() {
    HTTP.get("/api/plan").then(res => {
      console.log("请求成功:", res.data);
      var wordList = res.data.data.wordList
      var count = res.data.data.count
    //   wordList.length = 20
      this.setState({
        wordList: wordList || [],
        count: count
	  });
	  this.dateIndex = res.data.data.reciteIndex
	  this.newWordsCount = res.data.data.newWordsCount
    }).catch(err => {
      console.log("请求失败:", err);
    });
    let dateObj = new Date();
    this.startTime = dateObj.getTime()
  }

  postStrangeWordList() {
    if(this.postStrangeWordListLock) {
      message.success('无需重复提交，右下角退出即可');
      return
    }
    message.success('正在上传...');
    this.postStrangeWordListLock = true
    let dateObj = new Date();
    this.finishTime = dateObj.getTime()
    let studyTime = Math.round((this.finishTime - this.startTime) / 1000)
    console.log('时间', this.finishTime, this.startTime, studyTime)
    // const {isFinish} = this.state;
    let values = {};
    values.reciteIndex = this.dateIndex + 1;
    values.studyTime = studyTime;
    values.wordsList = this.uniqwordList;
    values.newWordsCount = this.newWordsCount;
    // values.isFinish = isFinish;
    console.log('Success:', JSON.stringify(values) );
    HTTP.patch("/api/plan",values).then(res => {
      console.log("请求成功:", res);
      this.postStrangeWordListLock = true
      message.success('新数据已同步');
    }).catch(err => {
      this.postStrangeWordListLock = false
      console.log("请求失败:", err);
      message.error('上传失败，请重试');
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
        // this.backToTransfer()
      } else {
        this.onSpaceKeyUp()
      }
      
    }
  }
  onClick(item) {
    if(this.audioControler != null && this.audioControler.paused == false){
      return
    }
    const {currentWordIndex, wordList, isCurrentWordStrange, isFinish} = this.state;
    if(item == "space") { //空格键
      if (isFinish) {
        this.postStrangeWordList()
        this.setState({
          whichKeyDown: null,
          whichKeyUp: 'space',
        });
        // this.backToTransfer()
      } else {
        this.onSpaceKeyUp()
      }
    } else if (item == "audio") {
      this.playTts();
    }
  }

  recordResult(wordid){
    this.recordWordList.push(
      wordid
    )
    console.log("recordResult" , this.recordWordList)
  }

  backToTransfer() {
    window.location.href = `${baseUrl}/#/Transfer`;
    window.location.reload()
  }

  onSpaceKeyUp() {
    if(this.state.singleWordTimes == 1) {
      this.goNext()
    } else {
      this.goSingleNextTime();
    }
    if(this.state.singleWordTimes == 0) {
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
    this.recordTodayWordsIdList()
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
      this.postStrangeWordList()
      message.success('恭喜你！已完成今日计划~');
    }
  }

  recordTodayWordsIdList() {
    const {currentWordIndex, wordList} = this.state;
    if(this.uniqwordList.indexOf(wordList[currentWordIndex].id) == -1) {
      this.uniqwordList.push(wordList[currentWordIndex].id);
    }
  }

  render() {
    const {currentWordIndex, whichKeyDown, whichKeyUp, wordList, isFinish, singleWordMeaningIsVisible, count} = this.state;
    return (
      <div className="recite_wrapper">
      <img className="background-img" src={whiteBookBg}></img>
      <div className="fix_header">
        <div className="header_left">
            <img className="main-img" src={promise}></img>
            <div className="home-page">
              {/* <Link to="/home">首页</Link> */}
            </div>
            <div className="about-us">关于我们</div>
            <div className="use-msg">使用说明</div>
        </div>
      </div>
      <div className="choose_header">
        <div className="decoration"></div>
        <div className="choose_left">背单词</div>
        <div className="choose_right">{this.wordLibName}</div>
      </div>
        {wordList.length != 0  && wordList[currentWordIndex] != null && 
          <div className="choose_content">
            <span className="word_phonetic_symbol">{isFinish ? '/səkˈses/' : `/${wordList[currentWordIndex].phoneticSymbols}/`}</span><br/>
            <span className="word_text">{isFinish ? 'success' : wordList[currentWordIndex].text}</span><br/>
            <div className="word_meaning_wrapper">
              {singleWordMeaningIsVisible &&
                <span className="word_meaning">{isFinish ? 'n. 成功; 胜利; 发财; 成名; 成功的人(或事物)' : wordList[currentWordIndex].meaning}</span>
              }
            </div>
            <br/>
            {!isFinish &&
              <audio ref={(audio) => { this.audioControler = audio; }} id="audioControler" controls="controls" hidden autoPlay src={`${baseUrl}/static/tts/${wordList[currentWordIndex].text}.mp3`}></audio>
            }
            {isFinish && 
              <div className="button_content_mid">
                <Button className={whichKeyDown == 'space' ? "style_button" : null }  shape="round" onClick={this.onClick.bind(this, "space")}>space  完成
                <div className={whichKeyUp == 'space' ? "click-animating-node" : null }></div></Button>  
              </div>
            }
            {!isFinish &&
                <div className="space_content" onClick={this.onClick.bind(this, "space")}>
                  <span className="radio_text">按下&nbsp;&nbsp;&nbsp;“&nbsp;&nbsp;&nbsp;</span>
                  <img className="space_icon" src={spaceIcon}></img>
                  <span className="radio_text">&nbsp;&nbsp;&nbsp;”&nbsp;&nbsp;&nbsp;继续</span>
                </div>
            }
          </div>
        }

        <div className="progress_audio_content">
          <div className="progress_content">
            <div className="progress_before"/>
            <span className="progress_text">{`${currentWordIndex + 1} / ${count}`}</span>
          </div>
          {!isFinish &&
            <div className="audio_content"  onClick={this.onClick.bind(this, "audio")}>
              <img className="audio_icon" src={audioIcon}></img>
              <span className="audio_text">点此发音</span>
            </div>
          }
        </div>
        <div className="back_content" onClick={this.backToTransfer.bind(this)}>
          <img className="back_icon" src={backIcon}></img>
          <span className="back_text">退出</span>
        </div>
      </div>
    );
  }
}
