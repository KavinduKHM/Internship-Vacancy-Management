import React from 'react';
import { FiTrendingUp, FiUsers, FiEye, FiClock } from 'react-icons/fi';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

const JobStats = ({ stats }) => {
  const applicationData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Applications',
        data: stats?.weeklyData || [0, 0, 0, 0],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
      },
    ],
  };

  const sourceData = {
    labels: ['Direct', 'LinkedIn', 'Email', 'Referral'],
    datasets: [
      {
        data: stats?.sources || [40, 30, 20, 10],
        backgroundColor: [
          'rgba(59, 130, 246, 0.5)',
          'rgba(34, 197, 94, 0.5)',
          'rgba(239, 68, 68, 0.5)',
          'rgba(156, 163, 175, 0.5)',
        ],
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-dark-card rounded-lg p-4 shadow-sm">
          <FiEye className="h-5 w-5 text-primary-600 mb-2" />
          <p className="text-2xl font-bold">{stats?.totalViews || 0}</p>
          <p className="text-sm text-slate-300">Total Views</p>
        </div>
        <div className="bg-dark-card rounded-lg p-4 shadow-sm">
          <FiUsers className="h-5 w-5 text-primary-600 mb-2" />
          <p className="text-2xl font-bold">{stats?.totalApplications || 0}</p>
          <p className="text-sm text-slate-300">Applications</p>
        </div>
        <div className="bg-dark-card rounded-lg p-4 shadow-sm">
          <FiTrendingUp className="h-5 w-5 text-primary-600 mb-2" />
          <p className="text-2xl font-bold">{stats?.applicationRate || 0}%</p>
          <p className="text-sm text-slate-300">Application Rate</p>
        </div>
        <div className="bg-dark-card rounded-lg p-4 shadow-sm">
          <FiClock className="h-5 w-5 text-primary-600 mb-2" />
          <p className="text-2xl font-bold">{stats?.avgResponseTime || 0}d</p>
          <p className="text-sm text-slate-300">Avg Response</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-card rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold mb-4">Application Trends</h3>
          <Line data={applicationData} options={{ responsive: true }} />
        </div>
        <div className="bg-dark-card rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold mb-4">Application Sources</h3>
          <div className="max-w-sm mx-auto">
            <Doughnut data={sourceData} options={{ responsive: true }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobStats;