import React, { useState, useEffect, useContext } from 'react';
import './index.less';
import EmptySvg from './assets/empty.svg';
import { PlanSelectModal } from '../../components/PlanSelectModal/index.jsx';
import HTTP, { HTTPV2 } from '../../utils/api.js';
import { message } from 'antd';
import { LayoutContext } from '../../components/Layout/index.jsx';

const ExamAndWrite = () => {
  const [examList, setExamList] = useState([]);
  const [writingList, setWritingList] = useState([]);
  const [hasOrg, setHasOrg] = useState(false);
  const [planModalVisible, setPlanModalVisible] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState();

  const { schoolList, getSchoolList } = useContext(LayoutContext)

  const jumpExam = () => {
    if (!hasOrg) {
      return;
    }
  };
  const jumpAllExam = () => {};

  const jumpWrite = () => {
    if (!hasOrg) {
      return;
    }
  };
  const jumpAllWrite = () => {};

  const planSelectConfirm = async planId => {
    await HTTPV2.post('/entity/select', {
      planId
    });
    message.success('绑定成功');
    setPlanModalVisible(false);
    getSchoolList();
  };

  const getSelectedSchool = list => {
    return list.find(item => item.selected);
  }

  const getWritingList = async () => {
    const res = await HTTP.get(`/stu-writing-exam/list2?status=1&submit=2&pageNo=1&pageSize=100`);
    const writingList = res?.data?.data;
    return writingList;
  }

  const getExamList = async () => {
    const res = await HTTP.get('/user-exam/exam-paper-info/list?isAll=0');
    const examList = res?.data?.data;
    return examList;
  }

  useEffect(() => {
    (async () => {
      const [examList, writingList] = await Promise.all([getExamList(), getWritingList()]);
      setExamList(examList);
      setWritingList(writingList);
    })();
    getWritingList();
  }, [selectedSchool]);

  useEffect(() => {
    if (!schoolList.length) {
      // 没有可绑定机构 toc用户
      return;
    }
    setHasOrg(true);
    // 未选择任何计划，让用户选择
    const selectedSchool = getSelectedSchool(schoolList);
    if (!selectedSchool) {
      setPlanModalVisible(true);
    } else {
      setSelectedSchool(selectedSchool);
    }
  }, [schoolList])

  return (
    <div className='exam-write-wrapper'>
      {hasOrg && selectedSchool && (
        <div className='header'>
          <div className='plan-name'>{selectedSchool.schoolName}{selectedSchool.className}</div>
          <div className='org-name'>{selectedSchool.schoolName}</div>
        </div>
      )}
      <div className='cards'>
        <div className='card-item'>
          <div className='card-header'>
            <div className='card-name'>考核测试</div>
            {hasOrg && <div className='all' onClick={jumpAllExam}>全部</div>}
          </div>
          <div className='card-content'>
            {!hasOrg ? (
              <>
                <div className='name'>敬请期待</div>
              </>
            ) : (<></>)}
            {hasOrg && examList && (
              <>
                <div className='name'>xxxxx</div>
                <div className='time'>1234</div>
              </>
            )}
            {hasOrg && !examList && (
              <>
                <EmptySvg className="empty-icon" />
                <div className='empty-tip'>暂无考核测试</div>
              </>
            )}
          </div>
          <div className={`card-button ${!hasOrg && 'disable'}`} onClick={jumpExam}>
            开始考试
          </div>
        </div>
        <div className='card-item'>
          <div className='card-header'>
            <div className='card-name'>作文任务</div>
            {hasOrg && <div className='all' onClick={jumpAllWrite}>全部</div>}
          </div>
          <div className='card-content'>
            {!hasOrg ? (
              <>
                <div className='name'>敬请期待</div>
              </>
            ) : (<></>)}
            {hasOrg && writingList && (
              <>
                <div className='name'>xxxxx</div>
                <div className='time'>1234</div>
              </>
            )}
            {hasOrg && !writingList && (
              <>
                <EmptySvg className="empty-icon" />
                <div className='empty-tip'>暂无作文任务</div>
              </>
            )}
          </div>
          <div className={`card-button ${!hasOrg && 'disable'}`} onClick={jumpWrite}>
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