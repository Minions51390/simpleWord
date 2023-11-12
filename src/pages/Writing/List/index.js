import React from "react";
import "./index.less";
import HTTP from "../../../utils/api.js";
import { Table, Pagination, message } from "antd";
import baseUrl from "../../../utils/config.js";
import Header from "../../../components/Header/index.js";

function getTaskStatus(status) {
  switch (status) {
    case 1:
      return "进行中";
      break;
    case 2:
      return "已结束";
      break;
    default:
      return "进行中";
  }
}

export default class WritingDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      writingList: [],
      pageNo: 1,
      pageSize: 10,
      totalCount: 0,
      columns1: [
        {
          title: "序号",
          dataIndex: "key",
          render: (text, record, index) => (
            <div>{index + 1 + (this.state.pageNo - 1) * this.state.pageSize}</div>
          ),
        },
        {
          title: "作文任务名称",
          key: "writingExamName",
          render: (text, record, index) => (
            <div
              style={{
                color: text.status === 2 && "rgba(3,35,82, 0.4)",
              }}
            >
              {text.writingExamName}
            </div>
          ),
        },
        {
          title: "任务类型",
          key: "examType",
          render: (text, record, index) => (
            <div
              style={{
                color:
                  text.status === 2
                    ? "rgba(3,35,82, 0.4)"
                    : text.examType === "test" && "#171C4B",
                fontWeight: text.examType === "test" && "600",
              }}
            >
              {text.examType === "practice" ? "练习" : "测验"}
            </div>
          ),
        },
        {
          title: "截止时间",
          key: "endTime",
          render: (text, record, index) => (
            <div
              style={{
                color: text.status === 2 && "rgba(3,35,82, 0.4)",
              }}
            >
              {text.endTime}
            </div>
          ),
        },
        {
          title: "任务状态",
          key: "status",
          render: (text, record, index) => (
            <div
              style={{
                color: text.status === 2 && "rgba(3,35,82, 0.4)",
              }}
            >
              {getTaskStatus(text.status)}
            </div>
          ),
        },
        {
          title: "完成情况",
          key: "completeState",
          render: (text, record, index) => (
            <div
              style={{
                color:
                  text.status === 2
                    ? text.isSubmit
                      ? "rgba(3,35,82, 0.4)"
                      : "#FF2525"
                    : text.isSubmit
                    ? "#032352"
                    : "#FF2525",
              }}
            >
              {text.status === 2
                ? text.isSubmit
                  ? "已完成"
                  : "未提交"
                : text.isSubmit
                ? "已提交"
                : "未提交"}
            </div>
          ),
        },
        {
          title: "最终成绩",
          key: "score",
          render: (text, record, index) => (
            <div
              style={{
                color: text.status === 2 && "rgba(3,35,82, 0.4)",
              }}
            >
              {text.isPublicScore ? text.score : "未公布" }
            </div>
          ),
        },
        {
          title: "操作",
          key: "edit",
          render: (text) => (
            <div className="edit">
              <div
                className="detail"
                onClick={this.handleScoreClick.bind(
                  this,
                  text.paperId,
                )}
              >
                查看卷面
              </div>
            </div>
          ),
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
  // 获取作文列表
  getWritingList() {
    const { pageNo, pageSize } = this.state;
    HTTP.get(
      `/stu-writing-exam/list2?status=0&submit=0&pageNo=${pageNo}&pageSize=${pageSize}`
    )
      .then((res) => {
        console.log(res);
        this.setState({
          writingList: res?.data?.data?.data,
          totalCount: res?.data?.data?.totalCount,
        });
      })
      .catch((err) => {
        message.error("个人信息获取失败!");
      });
  }
  handleScoreClick(val) {
    window.location.href = `${baseUrl}/#/writingDetail?paperId=${val}`;
  }
  // 翻页
  handleNowPagChange(val) {
    console.log('val', val)
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
    const { pageNo, pageSize, totalCount, columns1, writingList } = this.state;
    return (
      <div className="writing-list-container">
        <Header />
        <div className="writing-header">作文任务</div>
        <div className="writing-list">
          <Table
            columns={columns1}
            dataSource={writingList}
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
