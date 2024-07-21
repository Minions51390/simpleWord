import React from "react";
import "./index.less";
import HTTP from "../../../utils/api.js";
import { Table, Pagination, message } from "antd";
import baseUrl from "../../../utils/config.js";

function getTaskStatus(status) {
  switch (status) {
    case 1:
      return "进行中";
    default:
      return "已结束";
  }
}

export default class WritingDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      testList: [],
      pageNo: 1,
      pageSize: 10,
      totalCount: 0,
      columns1: [
        {
          title: "序号",
          dataIndex: "key",
          render: (text, record, index) => (
            <div>
              {index + 1 + (this.state.pageNo - 1) * this.state.pageSize}
            </div>
          ),
        },
        {
          title: "考核测试名称",
          key: "testName",
          render: (text, record, index) => <div>{text.testName}</div>,
        },
        {
          title: "截止时间",
          key: "endTime",
          render: (text, record, index) => <div>{text.endTime}</div>,
        },
        {
          title: "考试状态",
          key: "examStatus",
          render: (text, record, index) => (
            <div
              style={{
                color: text.examStatus === 0 && "rgba(3,35,82, 0.4)",
              }}
            >
              {getTaskStatus(text.examStatus)}
            </div>
          ),
        },
        {
          title: "完成情况",
          key: "paperFinish",
          render: (text, record, index) => (
            <div
              style={{
                color: text.paperFinish === 1 ? "#032352" : "#FF2525",
              }}
            >
              {text.paperFinish === 1 ? "已提交" : "未提交"}
            </div>
          ),
        },
        {
          title: "最终成绩",
          key: "score",
          render: (text, record, index) => (
            <div
              style={{
                color: [-1, 0].includes(text.score) && "rgba(3,35,82, 0.4)",
              }}
            >
              {![-1, 0].includes(text.score) ? text.score : "未公布"}
            </div>
          ),
        },
        {
          title: "操作",
          key: "edit",
          render: (text) => {
            return [-1, 0].includes(text.score) ? (
              <div
                style={{
                  color: "rgba(3,35,82, 0.4)",
                }}
              >
                查看卷面
              </div>
            ) : (
              <div className="edit">
                <div
                  className="detail"
                  onClick={this.handleScoreClick.bind(this, text.paperId)}
                >
                  查看卷面
                </div>
              </div>
            );
          },
        },
      ],
    };
  }

  componentWillMount() {
    this.inited();
  }

  componentDidMount() {}

  inited() {
    this.getWritingList();
  }
  // 获取考试列表
  getWritingList() {
    const { pageNo, pageSize } = this.state;
    HTTP.get(
      `/user-exam/exam-paper-info/list?isAll=1&pageNo=${pageNo}&pageSize=${pageSize}`
    )
      .then((res) => {
        console.log(res);
        this.setState({
          testList: res?.data?.data?.examList,
          totalCount: res?.data?.data?.totalCount,
        });
      })
      .catch((err) => {
        message.error("个人信息获取失败!");
      });
  }
  handleScoreClick(val) {
    console.log("跳转至详情页");
    window.location.href = `${baseUrl}/#/readingCom?paperId=${val}`;
  }
  // 翻页
  handleNowPagChange(val) {
    console.log("val", val);
    this.setState(
      {
        pageNo: val,
      },
      () => {
        this.getWritingList();
      }
    );
  }

  render() {
    const { pageNo, pageSize, totalCount, columns1, testList } = this.state;
    return (
      <div className="writing-list-container">
        {/* <Header /> */}
        <div className="writing-header">全部考核测试</div>
        <div className="writing-list">
          <Table
            columns={columns1}
            dataSource={testList}
            pagination={false}
            size={"middle"}
            bordered={false}
          />
          <div className="writing-pag">
            <Pagination
              defaultCurrent={1}
              pageSize={pageSize}
              current={pageNo}
              showSizeChanger={false}
              total={totalCount}
              onChange={this.handleNowPagChange.bind(this)}
            />
          </div>
        </div>
      </div>
    );
  }
}
