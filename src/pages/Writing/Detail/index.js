import React from "react";
import "./index.less";
import HTTP from "../../../utils/api.js";
import moment from "moment";
import {
  Form,
  Input,
  Tabs,
  Button,
  Checkbox,
  Col,
  Row,
  Radio,
  message,
  Progress,
  Popconfirm,
  Tooltip,
} from "antd";
import { LeftCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import baseUrl from "../../../utils/config.js";
import { getQueryString } from "../../../utils/stringUtils";
import Header from "../../../components/Header/index.js";

const { TextArea } = Input;
const dateFormat = "YYYY-MM-DD HH:mm:ss";
const content1 = (
  <div className="popColor">
    <div>①每个练习类型的作文任务有三次智能批改次数，请合理运用。</div>
    <div>②作文任务到达截止时间将会自动提交，记得及时完成作文任务。</div>
    <div>
      ③作文提交后，将无法再进行编辑和修改，包括智能批改功能。如需保存当前作文进度，并在以后继续修改，请选择“保存并退出”。
    </div>
  </div>
);
let autoSaveTimer = {};

export default class WritingDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paperId: getQueryString("paperId"),
      title: "",
      content: "",
      writing: {
        writingId: 1,
        writingCode: "000032",
        name: "xx",
        desc: "xx",
        title: "xx",
        creator: "xx",
        createTime: "xxxx-xx-xx-xx:xx",
        level: "cet4",
        maximum: 160,
        minimum: 120,
      },
      activeKey: "2",
      aiDetectionTimes: 1, // 可使用的ai检测次数，为0时禁止使用
      isSubmit: false, // 是否已提交
      aiReview: {
        aiComment:"",
        aiContentScore: 0,
        aiDetectionTimes: 3,
        aiScore: 0,
        aiSentenceScore: 0,
        aiStructureScore: 0,
        aiVocabularyScore: 0,
        aiSentenceComments: [],
      },
      comment: "",
      score: 0, // -1 为未考试
      examType: "", // practice
      submitTimes: 1, // 提交次数
      autoSaveTime: "",
      errorKey: 0,
      errorKeywords:['|'],
      errorSuggestions: [],
      submitContent: '',
    };
  }
  writingEditRef;
  errorItemRef;
  componentWillMount() {
    this.inited();
  }
  componentDidMount() {
    let _this = this
    this.writingEditRef.addEventListener('blur', function(e){
        console.log('e.target.textContent', e.target.textContent)
        _this.handleContentChange(e.target.textContent)
    })
  }

  componentWillUnmount() {
    clearInterval(autoSaveTimer);
  }
  // 初始化
  inited() {
    this.getWritingDetail();
    
  }

  // 作文标题修改
  handleTitleChange(event) {
    this.setState({
      title: event.target.value,
    });
  }
  // 作文正文修改
  handleContentChange(value) {
    this.setState({
        submitContent: value,
    });
  }

  // 获取作文内容
  getWritingDetail() {
    const { paperId } = this.state;
    HTTP.get(`/stu-writing-exam/paper-detail?paperId=${paperId}`)
      .then((res) => {
        let aiReview = res?.data?.data?.aiReview;
        let errorKeywords = [];
        let errorSuggestions = [];
        aiReview.aiSentenceComments && aiReview.aiSentenceComments.forEach((aiSentenceComment, index) => {
            aiSentenceComment.suggestions.forEach((suggestion, index)=>{
                suggestion.relStartPos = suggestion.startPos + aiSentenceComment.sentStartPos;
                errorKeywords.push(`|${suggestion.orgChunk}`);
                errorSuggestions.push(suggestion);
            })
        });
        this.setState({
          writing: res?.data?.data?.writingBaseInfo,
          title: res?.data?.data?.writingAnswer?.title,
          content: res?.data?.data?.writingAnswer?.content,
          submitContent: res?.data?.data?.writingAnswer?.content,
          aiReview: res?.data?.data?.aiReview,
          comment: res?.data?.data?.comment,
          examType: res?.data?.data?.examType,
          aiDetectionTimes: res?.data?.data?.aiDetectionTimes, // 可使用的ai检测次数，为0时禁止使用
          isSubmit: res?.data?.data?.isSubmit, // 是否已提交
          isPublicScore: res?.data?.data?.isPublicScore, // 是否已提交
          score: res?.data?.data?.score,
          errorKeywords,
          errorSuggestions,
        });
        if (!res?.data?.data?.isSubmit) {
          autoSaveTimer = setInterval(
            this.handleWritingSave.bind(this),
            1000 * 60
          );
        }
        if(res?.data?.data?.comment){
            this.handleTabChange('1')
        }else{
            this.handleTabChange('2')
        }
      })
      .catch((err) => {
        console.log('err', err)
        message.error("获取作文失败!");
      });
  }
  // 提交作文
  handleWritingSubmit() {
    const { paperId, title, submitContent } = this.state;
    return HTTP.post("/stu-writing-exam/submit", {
      paperId,
      title,
      content: submitContent,
      isSubmit: true,
    })
      .then((res) => {
        if (res.data.state !== 0) {
          message.error(`提交失败:${res.data.msg}`);
        } else {
          message.success(`提交成功!`);
          this.getWritingDetail();
        }
      })
      .catch((err) => {
        message.error("提交失败!");
      });
  }
  // 保存作文
  handleWritingSave() {
    console.log("handleWritingSave");
    const { paperId, title, submitContent } = this.state;
    this.setState({
      autoSaveTime: moment().format(dateFormat),
    });
    return HTTP.post("/stu-writing-exam/submit", {
      paperId,
      title,
      content: submitContent,
      isSubmit: false,
    });
  }
  // 保存并退出
  handleWritingSaveBack() {
    this.handleWritingSave()
      .then((res) => {
        clearInterval(autoSaveTimer);
        window.history.go(-1);
      })
      .catch((err) => {
        message.error("保存失败!");
      });
  }
  handleTabChange(val) {
    this.setState({
      activeKey: val,
    });
  }
  // ai阅卷
  getAiReview() {
    const { paperId, title, submitContent } = this.state;
    HTTP.post(`/stu-writing-exam/ai-review`, {
      paperId,
      title,
      content:submitContent,
    })
      .then((res) => {
        if (res.data.state === 0) {
            let aiReview = res?.data?.data;
            let errorKeywords = [];
            let errorSuggestions = [];
            aiReview.aiSentenceComments && aiReview.aiSentenceComments.forEach((aiSentenceComment, index) => {
                aiSentenceComment.suggestions.forEach((suggestion, index)=>{
                    suggestion.relStartPos = suggestion.startPos + aiSentenceComment.sentStartPos;
                    errorKeywords.push(`|${suggestion.orgChunk}`);
                    errorSuggestions.push(suggestion);
                })
            });
            this.setState({
                aiReview: aiReview,
                score: res?.data?.data?.aiScore,
                aiDetectionTimes: res?.data?.data?.aiDetectionTimes,
                activeKey: "1",
                errorKeywords,
                errorSuggestions,
            });
        } else {
            message.error(res.data.msg);
        }
      })
      .catch((err) => {
        message.error("ai阅卷失败!");
      });
  }

  computedTextCount(str) {
    let value = str;
    // 替换中文字符为空格
    value = value.replace(/[\u4e00-\u9fa5]+/g, " ");
    // 将换行符，前后空格不计算为单词数
    value = value.replace(/\n|\r|^\s+|\s+$/gi, "");
    // 多个空格替换成一个空格
    value = value.replace(/\s+/gi, " ");
    // 更新计数
    let length = 0;
    let match = value.match(/\s/g);
    if (match) {
      length = match.length + 1;
    } else if (value) {
      length = 1;
    }
    return length;
  }
  // 获取确认提示词
  getPopConfirmText(){
    const { content,aiDetectionTimes, writing} = this.state;
    const text1 = "是否确认提交？";
    const text3 = `您还有${aiDetectionTimes}次智能批改未用，且`
    const text4 = "提交后无法再修改和编辑作文内容。"
    const wordCount = this.computedTextCount(content);
    console.log('wordCount', wordCount);
    let text2 = "";
    let returnText = "";
    if(wordCount < writing.minimum){
        text2 = `当前词数${wordCount}，不足${writing.minimum}个，`
    }
    if(wordCount > writing.maximum){
        text2 = `当前词数${wordCount}，超过${writing.maximum}个，`
    }
    if(aiDetectionTimes === 0){
        returnText = `${text1}${text2}${text4}`
    }else{
        returnText = `${text1}${text2}${text3}${text4}`
    }
    return returnText
  }
    // 作文文章中鼠标点击错误
    handleWritingErrorClick(event){
        this.setState({
            errorKey: event?.key,
        });
        this.errorItemRef.childNodes[event?.key].scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
        });
    }

    //错误项列表点击
    handleErrorListItemClick(event){
        const {isSubmit} = this.state
        this.setState({
            errorKey: event?.key,
        });
        if(!isSubmit) return
        this.writingEditRef.childNodes[event?.key].scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
        });
    }

  // 获取带错误格式的文章
  getFinalContent(){
    const {errorKey, errorSuggestions, errorKeywords, content} = this.state
    let contentStr = content;
    console.log('contentStr', contentStr, errorSuggestions.length)
    function splitByMultipleValues(str, separators) {
        if (separators.length === 0) {
            return [str];
        }
        const firstSeparator = separators.shift();
        return str.split(firstSeparator).reduce((result, part) => {
            return result.concat(splitByMultipleValues(part, separators.slice()));
        }, []);
    }
    if(errorSuggestions.length > 0){
        errorSuggestions.forEach((suggestion, index)=>{
            suggestion.key = index;
            const pos = suggestion.relStartPos + index;
            contentStr = `${contentStr.slice(0, pos)}|${contentStr.slice(pos)}`;
        })
        const contentSplits = splitByMultipleValues(contentStr, [...errorKeywords]);
        return (
            errorSuggestions.map((suggestion, index)=>{
                return (
                    <span>
                        <span>{contentSplits[index]}</span>
                        <span
                            className={[
                                'content-error-suggestions',
                                suggestion.showType === 2 ? 
                                    errorKey === suggestion.key ? 
                                        'content-suggestion-mouseover' : 'content-suggestion'
                                : errorKey === suggestion.key ? 
                                        'content-error-mouseover' : 'content-error'
                            ].join(' ')}
                            onClick={this.handleWritingErrorClick.bind(this, suggestion)}
                        >{errorKeywords[index].replace('|', '')}</span>
                        {
                            index === errorSuggestions.length - 1 ? <span>{contentSplits[contentSplits.length - 1]}</span> :''
                        }
                    </span>
                )
            })
        )
    }else{
        return (
            <span>{content}</span>
        )
    }
}

  errorItem() {
        const { aiReview, errorKey } = this.state;
        return (
            <div ref={(ele) => (this.errorItemRef = ele)}>
            {aiReview.aiSentenceComments.map((aiSentenceComment) => {
                return aiSentenceComment.suggestions.map((suggestion) => {
                    return (
                        <div
                            className={[
                                "list-item",
                                suggestion.showType === 2 ? "suggestion-item" : "error-item",
                                suggestion.key === errorKey ? 
                                    suggestion.showType === 2 ? "suggestion-item-select" : "error-item-select"
                                : ""
                            ].join(' ')}
                            onClick={this.handleErrorListItemClick.bind(this, suggestion)}
                        >
                            <span className="error-item-count" />
                            <div className="error-text">{suggestion.orgChunk}: {suggestion.errBaseInfo}</div>
                        </div>
                    );
                })
            })}
            </div>
        );
    }

  render() {
    const {
      paperId,
      title,
      content,
      writing,
      examType,
      aiDetectionTimes,
      isSubmit,
      isPublicScore,
      score,
      aiReview,
      comment,
      autoSaveTime,
      activeKey,
      errorSuggestions,
    } = this.state;
    return (
      <div className="writing-detail-container">
        {/* <Header /> */}
        <div className="writing-header">
          <div
            className="header-back"
            onClick={this.handleWritingSaveBack.bind(this)}
          >
            <LeftCircleOutlined />
            <div className="back-text">保存并退出</div>
          </div>
          <div className="header-tips">
            <Tooltip
              title={content1}
              trigger="hover"
              placement="top"
              color="rgba(0, 0, 0, 0.7)"
              overlayStyle={{ minWidth: "440px" }}
            >
              <InfoCircleOutlined />
            </Tooltip>
            <div className="tips-text">温馨提示</div>
          </div>
        </div>
        <div className="writing-detail">
          <div className="detail-content">
            <div className="content-left">
              <div className="left-fir">
                <div className="fir-word-num">
                  词数统计：{this.computedTextCount(content)}词
                </div>
                <div className="fir-save">
                  {autoSaveTime ? `${autoSaveTime}已自动保存` : ""}{" "}
                </div>
              </div>
              <div className="left-sec">
                <Input
                  placeholder="请输入标题"
                  size="large"
                  bordered={false}
                  value={title}
                  disabled={isSubmit}
                  onChange={this.handleTitleChange.bind(this)}
                />
              </div> 
              <div className="left-thr">
                <div className="writing-text" style={{opacity:isSubmit? 0.7: 1}} suppressContentEditableWarning contentEditable={!isSubmit} ref={(ele) => (this.writingEditRef = ele)}>
                    {this.getFinalContent()}
                </div> 
              </div>
            </div>
            <div className="content-right">
              {examType === "practice" ? (
                <div className="ai-review">
                  <Button
                    className="btn"
                    type="primary"
                    shape="round"
                    onClick={this.getAiReview.bind(this)}
                    disabled={aiDetectionTimes === 0 || isSubmit}
                  >
                    AI智能批改({aiDetectionTimes}/3)
                  </Button>
                </div>
              ) : (
                ""
              )}
              <div className="content-tab">
                <Tabs
                  activeKey={activeKey}
                  defaultActiveKey="2"
                  onChange={this.handleTabChange.bind(this)}
                >
                  { isPublicScore || (!isSubmit && aiReview.aiComment) ? (
                    <Tabs.TabPane tab="评语" key="1">
                      <div className="content-demand-commit">
                        <div className="commit-left">{comment || aiReview.aiComment}</div>
                        <div className="pp">
                          <Progress
                            type="dashboard"
                            percent={score}
                            format={(percent) => `${percent}`}
                          />
                        </div>
                      </div>
                    </Tabs.TabPane>
                  ) : (
                    ""
                  )}
                  <Tabs.TabPane tab="写作要求" key="2">
                    <div className="content-demand">
                      <div className="demand-fir">
                        <div className="demand-level">
                          <span className="demand-sec">作文等级：</span>
                          {writing.level}
                        </div>
                        <div className="demand-num">
                          <span className="demand-sec">词数限制：</span>
                          {writing.minimum}-{writing.maximum}
                        </div>
                      </div>
                      <div className="demand-title">
                        <span className="demand-sec">作文标题：</span>
                        {writing.title}
                      </div>
                      <div className="demand-desc">
                        <span className="demand-sec">写作要求：</span>
                        {writing.desc}
                      </div>
                    </div>
                  </Tabs.TabPane>
                </Tabs>
              </div>
              <div className="commit-error">
                <div className="fir-line">
                  <div className="title">纠错</div>
                  <div className="count">
                    {isPublicScore || (!isSubmit && aiReview.aiComment) ? errorSuggestions.length : 0}
                  </div>
                </div>
                {isPublicScore || (!isSubmit && aiReview.aiComment) ? <div className="error-content">{this.errorItem()}</div> : ''}
              </div>
            </div>
          </div>
          <div className="content-control">
            <div className="control-text">
              （提交后无法再修改和编辑作文内容）
            </div>
            <Popconfirm
              placement="top"
              title={this.getPopConfirmText.bind(this)}
              onConfirm={this.handleWritingSubmit.bind(this)}
              okText="确认"
              cancelText="取消"
              disabled={isSubmit}
            >
              <Button className="btn" type="primary" disabled={isSubmit}>
                提交
              </Button>
            </Popconfirm>
          </div>
        </div>
      </div>
    );
  }
}
