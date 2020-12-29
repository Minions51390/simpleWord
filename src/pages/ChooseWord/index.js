import React from 'react';
import './index.less'
import { Link } from "react-router-dom";
import Axios from 'axios';
import { Form, Radio, Button, Checkbox, Col, Row, Progress } from 'antd';

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
      currentWord: {
        wordIndex: 0,
      },
      count: 0,
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
  }

  componentWillMount() {
    this.wordLibName = getQueryString('lib_name')
    this.wordLibId = parseInt(getQueryString('lib_id'))
    this.loadWordLib(this.wordLibName, this.wordLibId)
  }

  loadWordLib(wordLibName, wordLibId) {
    HTTP.get(`/api/dictionary/words/${wordLibId}`).then(res => {
      console.log("请求成功:", res.data);
      var wordList = res.data.data.words
      var count = res.data.data.count
      // console.log("wordList:", wordList, res.data.data.words.length);
      wordList.length = 20
      this.setState({
        wordList: wordList || [],
        count: count
      });
    }).catch(err => {
      console.log("请求失败:", err);
    });
  }

  postStrangeWordList() {
    let values = {};
    // values.wordLibName = this.wordLibName;
    values.dictionaryId = this.wordLibId;
    values.strangeWordList = this.recordWordList;
    console.log('Success:', JSON.stringify(values));
    HTTP.post("/api/plan",values).then(res => {
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
      } else {
        if (isCurrentWordStrange == null) {
          return
        }
        if (isCurrentWordStrange) {
          this.recordResult(wordList[currentWordIndex].Id)
        }
        this.goNext()
      }
    }
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
      } else {
        if (isCurrentWordStrange == null) {
          return
        }
        if (isCurrentWordStrange) {
          this.recordResult(parseInt(wordList[currentWordIndex].Id))
        }
        this.goNext()
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
        currentWordIndex: this.state.currentWordIndex + 1,
        isCurrentWordStrange: null,
        whichRadioChecked: null,
      });
      this.forceUpdate()
    } else {
      this.setState({
        isCurrentWordStrange: null,
        isFinish: true
      });
    }
    // console.log("this.myLeftRadioRef", this.myLeftRadioRef)
    // console.log("this.myRightRadioRef", this.myRightRadioRef)
    // this.myLeftRadioRef != null && this.myLeftRadioRef.current.blur();
    // this.myRightRadioRef != null && this.myRightRadioRef.current.blur();
  }

  componentDidMount() {
    document.onkeyup = this.onKeyUp.bind(this);
    document.onkeydown = this.onKeyDown.bind(this);
  }

  render() {
    const {currentWordIndex, whichKeyDown, whichKeyUp, wordList, isFinish, count} = this.state;
    return (
      <div className="choose_wrapper">
        <img className="background-img" src={whiteBookBg}></img>
        <div className="fix_header">
          <div className="header_left">
              <img className="main-img" src={promise}></img>
              <div className="home-page">
                <Link to="/home">首页</Link>
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
        {wordList.length != 0 && wordList[currentWordIndex] != null &&
          <div className="choose_content">
            <span className="word_phonetic_symbol">{isFinish ? '/səkˈses/' : `/${wordList[currentWordIndex].PhoneticSymbols}/`}</span><br/>
            <span className="word_text">{isFinish ? 'success' : wordList[currentWordIndex].Text}</span><br/>
            <div className="word_meaning_wrapper">
              <span className="word_meaning">{isFinish ? 'n. 成功; 胜利; 发财; 成名; 成功的人(或事物)' : wordList[currentWordIndex].Meaning}</span>
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
              {/* <div className="button_content_space_between"> */}
              {/* //  <Button className={whichKeyDown == 'left' ? "style_button" : null } icon={<ArrowLeftOutlined />} shape="round" onClick={this.onClick.bind(this, "left")}>会
              //     <div className={whichKeyUp == 'left' ? "click-animating-node" : null }></div>
                  
              //   </Button> */}
                  <Radio 
                    value = {'left'}
                    // checked={whichRadioChecked === 'left' ? true : false}
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
                  // checked={whichRadioChecked === 'right' ? true : false}
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
          <span className="progress_text">{`${currentWordIndex + 1} / ${count}`}</span>
        </div>
        <div className="back_content">
          <img className="back_icon" src={backIcon}></img>
          <span className="back_text">退出</span>
        </div>
      </div>
    );
  }
}
