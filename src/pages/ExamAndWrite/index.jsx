import React, { useState, useEffect, useContext } from "react";
import "./index.less";
import EmptySvg from "./assets/empty.svg";
import ArrowSvg from "./assets/arrow.svg";
import { PlanSelectModal } from "../../components/PlanSelectModal/index.jsx";
import HTTP, { HTTPV2 } from "../../utils/api.js";
import { message } from "antd";
import { LayoutContext } from "../../components/Layout/index.jsx";
import writeBg from "./assets/writebg.png";
import examBg from "./assets/exambg.png";
import bg from "./assets/bg.png";
import { useHistory } from "react-router-dom";

const ExamAndWrite = () => {
  const [examList, setExamList] = useState([]);
  const [writingList, setWritingList] = useState([]);
  const [hasOrg, setHasOrg] = useState(false);
  const [planModalVisible, setPlanModalVisible] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState();

  let history = useHistory();

  const { schoolList, getSchoolList, getUserInfo, userInfo } =
    useContext(LayoutContext);

  const jumpExam = () => {
    if (!hasOrg || !examList?.length) {
      return;
    }
    const currentExam = examList?.[0];
    history.push(`/readingCom?paperId=${currentExam.paperId}`);
    // history.push(`/testWord?testType=${currentExam.testType}&paperId=${currentExam.paperId}`);
  };
  const jumpAllExam = () => {};

  const jumpWrite = () => {
    if (!hasOrg || !writingList?.length) {
      return;
    }
    const currentWriting = writingList?.[0];
    history.push(`/writingDetail?paperId=${currentWriting.paperId}`);
  };
  const jumpAllWrite = () => {
    history.push("/writingList");
  };

  const planSelectConfirm = async (planId) => {
    await HTTPV2.post("/entity/select", {
      planId,
    });
    message.success("绑定成功");
    setPlanModalVisible(false);
    getSchoolList();
    getUserInfo();
  };

  const getSelectedSchool = (list) => {
    return list.find((item) => item.selected);
  };

  const getWritingList = async () => {
    const res = await HTTP.get(
      `/stu-writing-exam/list2?status=1&submit=2&pageNo=1&pageSize=100`
    );
    const writingList = res?.data?.data?.data;
    return writingList;
  };

  const getExamList = async () => {
    const res = await HTTP.get("/user-exam/exam-paper-info/list?isAll=0");
    const examList = res?.data?.data;
    return examList;
  };

  useEffect(() => {
    if (selectedSchool) {
      (async () => {
        const [examList, writingList] = await Promise.all([
          getExamList(),
          getWritingList(),
        ]);
        setExamList(examList);
        setWritingList(writingList);
      })();
    }
  }, [selectedSchool]);

  useEffect(() => {
    if (!schoolList.length) {
      // 没有可绑定机构 toc用户
      return;
    }
    setHasOrg(true);
    // 未选择任何计划，让用户选择
    const selectedSchool = getSelectedSchool(schoolList);
    // 如果只有1个可选择的，自动选择该机构
    if (!selectedSchool && schoolList.length === 1) {
      planSelectConfirm(schoolList[0].planId);
    } else if (!selectedSchool) {
      setPlanModalVisible(true);
    } else {
      setSelectedSchool(selectedSchool);
    }
  }, [schoolList]);

  return (
    <div
      className="exam-write-wrapper"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {hasOrg && selectedSchool && (
        <div className="header">
          <div className="plan-name">
            {selectedSchool.schoolName}
            {selectedSchool.className}
          </div>
          <div className="sub-info">
            <div className="org-name">{selectedSchool.schoolName}</div>
            {userInfo?.realName && (
              <div className="student-info">
                {userInfo?.realName} | {selectedSchool.studentNum}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="cards">
        <div
          className="card-item"
          style={{ backgroundImage: `url(${examBg})` }}
        >
          <div className="card-header">
            <div className="card-name">考核测试</div>
            {hasOrg && (
              <div className="all" onClick={jumpAllExam}>
                <div>全部</div>
                <ArrowSvg style={{ marginLeft: "4px" }} />
              </div>
            )}
          </div>
          <div className="card-content">
            {!hasOrg ? (
              <>
                <div className="name">敬请期待</div>
              </>
            ) : (
              <></>
            )}
            {Boolean(hasOrg && examList?.length) && (
              <>
                <div className="name">{examList?.[0]?.testName}</div>
                <div className="time">{examList?.[0]?.endTime}</div>
              </>
            )}
            {Boolean(hasOrg && !examList.length) && (
              <>
                <EmptySvg className="empty-icon" />
                <div className="empty-tip">暂无考核测试</div>
              </>
            )}
          </div>
          <div
            className={`card-button ${!examList.length && "disable"}`}
            onClick={jumpExam}
          >
            开始考试
          </div>
        </div>
        <div
          className="card-item"
          style={{ backgroundImage: `url(${writeBg})` }}
        >
          <div className="card-header">
            <div className="card-name">作文任务</div>
            {hasOrg && (
              <div className="all" onClick={jumpAllWrite}>
                <div>全部</div>
                <ArrowSvg style={{ marginLeft: "4px" }} />
              </div>
            )}
          </div>
          <div className="card-content">
            {!hasOrg ? (
              <>
                <div className="name">敬请期待</div>
              </>
            ) : (
              <></>
            )}
            {Boolean(hasOrg && writingList?.length) && (
              <>
                <div className="name">{writingList?.[0]?.writingExamName}</div>
                <div className="time">{writingList?.[0]?.endTime}</div>
              </>
            )}
            {Boolean(hasOrg && !writingList.length) && (
              <>
                <EmptySvg className="empty-icon" />
                <div className="empty-tip">暂无作文任务</div>
              </>
            )}
          </div>
          <div
            className={`card-button ${!writingList?.length && "disable"}`}
            onClick={jumpWrite}
          >
            开始写作
          </div>
        </div>
      </div>
      <PlanSelectModal
        visible={planModalVisible}
        close={() => setPlanModalVisible(false)}
        schoolList={schoolList}
        confirm={planSelectConfirm}
      />
    </div>
  );
};

export default ExamAndWrite;
