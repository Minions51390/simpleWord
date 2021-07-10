import React from 'react';
import './index.less'
import { Link } from "react-router-dom";
import Axios from 'axios';
import { Form, Radio, Button, Checkbox, Col, Row, message} from 'antd';
import baseUrl from '../../utils/config.js';

import { ArrowLeftOutlined, ArrowRightOutlined} from '@ant-design/icons';
// import getQueryString from ''
import {getQueryString} from '../../utils/stringUtils';
import HTTP from '../../utils/api.js';
import promise from '../home/assets/promise.png';
import whiteBookBg from '../../assets/whiteBookBg.png';
import backIcon from '../../assets/backIcon.png';
import spaceIcon from '../../assets/spaceIcon.png';
import leftIcon from './assets/leftIcon.png';
import rightIcon from './assets/rightIcon.png';

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
      wordList: [],
      isLatest: false, // 一旦为true意味着已经选完全部了。
      totalCount: 0,
      // startIndex: 0, // 本次返回的首个单词的索引
      // endIndex: 299, // 本次返回的末尾单词的索引
      // dictionaryId: 0,
      // count: 0,
      currentWordIndex: 0,
      whichKeyDown: null,
      whichRadioChecked: null,
      whichKeyUp: null,
      isFinish: false,
      isCurrentWordStrange: null,
    };
    this.recordWordList = [];
    this.wordLibName = null
    this.wordLibId = null
    this.choiceIndex = null
    this.initChoiceIndex = null
  }

  componentWillMount() {
    var url = window.location.href.split('#')[0];
    if (url != document.referrer) {
      window.location.href = `${baseUrl}/#/Transfer`;
      window.location.reload()
    }
    this.wordLibName = getQueryString('lib_name')
    this.wordLibId = parseInt(getQueryString('lib_id'))
    this.initChoiceIndex = parseInt(getQueryString('choiceIndex'))
    this.choiceIndex = parseInt(getQueryString('choiceIndex'))
    this.wordcount = parseInt(getQueryString('wordcount'))
    
    this.setState({
      currentWordIndex: this.choiceIndex
    })
    if(!this.wordLibName || !this.wordLibId) {
      window.location.href = `${baseUrl}/#/Transfer`;
      window.location.reload()
      message.info("获取单词列表失败")
    } else {
      this.loadWordLib(this.wordLibName, this.wordLibId, this.choiceIndex)
    }
  }

  loadWordLib(wordLibName, wordLibId, choiceIndex) {
    if(this.state.currentWordIndex != 0) {
      this.postStrangeWordList(this.state.currentWordIndex - 1)
    }
    
    const key = 'updatable'
    message.loading({ content: 'Loading...', key});
    HTTP.get('/api/dictionary/words', {
      params: {
        startIndex: choiceIndex,
        dicId: wordLibId,
      }
    }).then(res => {
      
      console.log("请求成功:", res.data);
      var wordList = res.data.data.words
      var count = res.data.data.count
      var isLatest = res.data.data.isLatest
      var totalCount = res.data.data.totalCount
      var endIndex = res.data.data.endIndex
      this.choiceIndex = endIndex + 1
      // console.log("wordList:", wordList, res.data.data.words.length);
      // wordList.length = 20
      this.setState(
        {
          isLatest: isLatest, 
          totalCount: totalCount,
          wordList: this.state.wordList.concat(wordList),
        }, 
        message.success({ content: 'Loaded!', key, duration: 2 })
      );
    }).catch(err => {
      console.log("请求失败:", err);
      message.console.error({ content: err, key, duration: 2 });
    });
  }

  postStrangeWordList(latestViewWordIndex, needback) {
    let values = {};
    // values.wordLibName = this.wordLibName;
    values.dictionaryId = this.wordLibId;
    values.strangeWordList = this.recordWordList;
    values.latestViewWordIndex = latestViewWordIndex;
    console.log('Success:', JSON.stringify(values));
    HTTP.post("/api/plan",values).then(res => {
      console.log("请求成功:", res);
      if(needback == true) {
        window.location.href = `${baseUrl}/#/Transfer`;
        window.location.reload()
      }
    }).catch(err => {
      console.log("请求失败:", err);
    });
    this.recordWordList = []
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
      // this.setState({
      //   whichRadioChecked: 'left'
      // });
    } else if(event.keyCode == 39) { //方向键 →
      // this.setState({
      //   whichRadioChecked: 'right'
      // });
    } else if(event.keyCode == 32) { //空格键
      // if (isCurrentWordStrange == null) {
      //   return
      // }
      this.setState({
        whichRadioChecked: null,
        // isCurrentWordStrange: true
      });
    }
    
  }

  onKeyUp(event) {
      
    const {currentWordIndex, wordList, isCurrentWordStrange, isFinish} = this.state;
    if(event.keyCode == 37) { //方向键 ← 
      this.setState({
        whichRadioChecked: 'left',
        isCurrentWordStrange: false
      });
    } else if(event.keyCode == 39) { //方向键 →
      this.setState({
        whichRadioChecked: 'right',
        isCurrentWordStrange: true
      });
    } else if(event.keyCode == 32) { //空格键
      if (isFinish) {
        this.postStrangeWordList()
        this.setState({
          whichKeyDown: 'space',
          whichKeyUp: 'space',
        });
        this.backToTransfer()
        message.success('新数据已同步');
      } else {
        if (isCurrentWordStrange == null) {
          return
        }
        if (isCurrentWordStrange) {
          this.recordResult(wordList[currentWordIndex - this.initChoiceIndex].id)
        }
        this.goNext()
      }
    }
  }

  backToTransfer() {
    this.postStrangeWordList(this.state.currentWordIndex - 1, true)
  }

  onClick(item) {
    const {currentWordIndex, wordList, isCurrentWordStrange, isFinish} = this.state;
    if(item == "left") {
      console.log("会")
      this.setState({
        whichRadioChecked: 'left',
        isCurrentWordStrange: false
      });
    } else if(item == "right") {
      console.log("不会")
      this.setState({
        whichRadioChecked: 'right',
        isCurrentWordStrange: true
      });
    } else if(item == "space") { //空格键
      if (isFinish) {
        this.postStrangeWordList()
        this.setState({
          whichKeyDown: 'space',
          whichKeyUp: 'space'
        });
        // window.location.href = `${baseUrl}/#/home`;
        this.backToTransfer()
        message.success('新数据已同步');
      } else {
        if (isCurrentWordStrange == null) {
          return
        }
        if (isCurrentWordStrange) {
          this.recordResult(parseInt(wordList[currentWordIndex - this.initChoiceIndex].id))
        }
        this.goNext()
      }
    }
  }

  recordResult(wordid){
    this.recordWordList.push(
      wordid
    )
    if(this.recordWordList.length == this.wordcount) {
      message.success('选词数已够今日背词需要哦');
    }
    if(this.recordWordList.length == this.wordcount * 2) {
      message.success('很棒了，可已先去背一背再选啦, 接着选也行~');
    }
    console.log("recordResult" , this.recordWordList)
  }

  goNext() {
    const totalCount = this.state.totalCount
    const isLatest = this.state.isLatest
    if(this.state.currentWordIndex + 1 < totalCount) {
      this.setState({
        currentWordIndex: this.state.currentWordIndex + 1,
        isCurrentWordStrange: null,
        whichRadioChecked: null,
      });
      if(this.state.currentWordIndex + 1 > this.state.wordList.length - 10 && !isLatest) {
        this.loadWordLib(this.wordLibName, this.wordLibId, this.choiceIndex)
      }
      this.forceUpdate()
    } else {
      this.setState({
        isCurrentWordStrange: null,
        isFinish: true
      });
      // message.success('本阶段选词结束啦，要坚持背鸭~');
    }
  }

  componentDidMount() {
    document.onkeyup = this.onKeyUp.bind(this);
    document.onkeydown = this.onKeyDown.bind(this);
  }

  render() {
    const {currentWordIndex, whichKeyDown, whichKeyUp, wordList, isFinish, totalCount} = this.state;
    return (
      <div className="choose_wrapper">
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
          <div className="choose_left">选择单词</div>
          <div className="choose_right">{this.wordLibName}</div>
        </div>
        {wordList.length != 0 && wordList[currentWordIndex - this.initChoiceIndex] != null &&
          <div className="choose_content">
            <span className="word_phonetic_symbol">{isFinish ? '/səkˈses/' : `/${wordList[currentWordIndex - this.initChoiceIndex].phoneticSymbols}/`}</span><br/>
            <span className="word_text">{isFinish ? 'success' : wordList[currentWordIndex - this.initChoiceIndex].text}</span><br/>
            <div className="word_meaning_wrapper">
              <span className="word_meaning">{isFinish ? 'n. 成功; 胜利; 发财; 成名; 成功的人(或事物)' : wordList[currentWordIndex - this.initChoiceIndex].meaning}</span>
            </div>
            <br/>
            {isFinish ? 
              <div className="button_content_mid">
                <Button className={whichKeyDown == 'space' ? "style_button" : null }  shape="round" onClick={this.onClick.bind(this, "space")}>space  完成
                <div className={whichKeyUp == 'space' ? "click-animating-node" : null }></div></Button>  
              </div>
            :
              <Radio.Group 
                className="button_content_space_between"
                name="radiogroup"
                defaultValue={this.state.whichRadioChecked}
                value={this.state.whichRadioChecked}> 
                  <Radio 
                    value = {'left'}
                    >
                    <span className="radio_text" >会</span>
                    <img className="left_icon" src={leftIcon}></img>
                    <div className="radio_cover" onClick={this.onClick.bind(this, "left")}></div>
                  </Radio>
                <div className="space_content" onClick={this.onClick.bind(this, "space")}>
                  <span className="radio_text">确认并继续</span>
                  <img className="space_icon" src={spaceIcon}></img>
                </div>
                {/* <Button className={whichKeyDown == 'space' ? "style_button" : null } shape="round" onClick={this.onClick.bind(this, "space")}>space  确定
                <div className={whichKeyUp == 'space' ? "click-animating-node" : null }></div></Button>   */}
                <Radio
                  value = {'right'}
                  >
                  <span className="radio_text" >不会</span>
                  <img className="right_icon" src={rightIcon}></img>
                  <div className="radio_cover" onClick={this.onClick.bind(this, "right")}></div>
                </Radio>
                {/* // <Button className={whichKeyDown == 'right' ? "style_button" : null } icon={<ArrowRightOutlined />} shape="round" onClick={this.onClick.bind(this, "right")}>不会
                // <div className={whichKeyUp == 'right' ? "click-animating-node" : null }></div></Button> */}
              {/* </div> */}
              </Radio.Group>
            }
          </div>
        }
        <div className="progress_content">
          <div className="progress_before"/>
          <span className="progress_text">{`${currentWordIndex + 1} / ${totalCount}`}</span>
        </div>
        <div className="back_content" onClick={this.backToTransfer.bind(this)}>
          <img className="back_icon" src={backIcon}></img>
          <span className="back_text">退出</span>
        </div>
      </div>
    );
  }
}
