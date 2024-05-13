import React, { useMemo, useState } from 'react';
import { Modal, message } from 'antd';
import './index.less';
import CheckSvg from '../../assets/check.svg';

export const PlanSelectModal = ({ visible, close, confirm, schoolList }) => {
  const [finalSelectedPlanId, setfinalSelectedPlanId] = useState();

  const selectedPlanId = useMemo(() => {
    const defaultSelectedPlanId = schoolList.find(item => item.selected)?.planId;
    return finalSelectedPlanId || defaultSelectedPlanId;
  }, [schoolList, finalSelectedPlanId]);

  const handleClick = planId => {
    setfinalSelectedPlanId(planId)
  };

  const handleConfirm = () => {
    if (selectedPlanId === undefined) {
      message.info('请选择计划');
      return;
    }
    confirm(selectedPlanId);
  };
  return (
    <Modal width={680} style={{ borderRadius: '4px' }} visible={visible} footer={null} closable={false} onCancel={close}>
      <div className='plan-select-modal'>
        <div className='title'>请选择你的计划</div>
        <div className='plan-list'>
          {schoolList.map(item => (
            <div className={`plan-item ${selectedPlanId === item.planId && 'checked'}`} onClick={e => handleClick(item.planId)} key={item.planId}>
              <div className='plan-item-left'>
                <div className='plan-name'>{item.schoolName}{item.className}</div>
                <div className='tags'>
                  <span className='org'>{item.schoolName}</span>
                  <span className='name'>{item.realName}</span>
                </div>
              </div>
              {selectedPlanId === item.planId && <CheckSvg />}
            </div>
          ))}
        </div>
        <div className='footer'>
          <div className='cancel' onClick={close}>取消</div>
          <div className='confirm' onClick={handleConfirm}>确认</div>
        </div>
      </div>
    </Modal>
  );
};