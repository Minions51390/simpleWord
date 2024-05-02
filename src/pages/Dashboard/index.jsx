import React from 'react';

const Dashboard = () => {
  return (
    <div className="dashboard-dom">
      <iframe
        className="dashboard-iframe"
        src="/admin/#/stu"
        // src="http://localhost:3006/admin/#/stu/"
        frameborder="no"
        border="0"
        marginwidth="0"
        marginheight="0"
        allowtransparency="yes"
      ></iframe>
    </div>
  );
};

export default Dashboard;