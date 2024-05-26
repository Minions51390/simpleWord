import React, { useState, useEffect } from 'react';
import './index.less';

const CountDownTimer = ({ seconds, onTimeUp }) => {
    const [count, setCount] = useState(seconds);
    
    useEffect(() => {
        let timerId;
        if (count > 0) {
        timerId = setInterval(() => {
            setCount(prevCount => prevCount - 1);
        }, 1000);
        }
        if (count === 0) {
            clearInterval(timerId);
            onTimeUp();
        }
        return () => clearInterval(timerId);
    }, [count, onTimeUp]);
    
    return (
        <div className="code-count">{count}秒后重试</div>
    );
};
 
export default CountDownTimer;