import React from 'react';
import JobStats from './JobStats';
import JobList from './JobList';

const EmployerDashboard = () => {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <JobStats />
      <JobList />
    </div>
  );
};

export default EmployerDashboard;
