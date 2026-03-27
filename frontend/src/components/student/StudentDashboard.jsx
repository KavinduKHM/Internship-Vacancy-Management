import React from 'react';
import { Link } from 'react-router-dom';
import { useStudent } from '../../hooks/useStudent';
import { FiBriefcase, FiBookmark, FiUser, FiTrendingUp, FiCheckCircle, FiClock, FiEye } from 'react-icons/fi';
import Loader from '../common/Loader';
import EmptyState from '../common/EmptyState';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const StudentDashboard = () => {
  const { useApplicationStats, useAppliedJobs, useSavedJobs } = useStudent();
  const { data: stats, isLoading: statsLoading } = useApplicationStats();
  const { data: appliedJobs, isLoading: appliedLoading } = useAppliedJobs({ limit: 5 });
  const { data: savedJobs, isLoading: savedLoading } = useSavedJobs({ limit: 5 });

  if (statsLoading || appliedLoading || savedLoading) {
    return <Loader />;
  }

  const monthlyData = {
    labels: stats?.monthLabels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Applications',
        data: stats?.monthlyApplications || [0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  const statusData = {
    labels: ['Pending', 'Reviewed', 'Interview', 'Accepted', 'Rejected'],
    datasets: [
      {
        data: [
          stats?.statusCounts?.pending || 0,
          stats?.statusCounts?.reviewed || 0,
          stats?.statusCounts?.interview || 0,
          stats?.statusCounts?.accepted || 0,
          stats?.statusCounts?.rejected || 0,
        ],
        backgroundColor: [
          'rgba(234, 179, 8, 0.5)',
          'rgba(59, 130, 246, 0.5)',
          'rgba(139, 92, 246, 0.5)',
          'rgba(34, 197, 94, 0.5)',
          'rgba(239, 68, 68, 0.5)',
        ],
        borderColor: [
          'rgb(234, 179, 8)',
          'rgb(59, 130, 246)',
          'rgb(139, 92, 246)',
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Student Dashboard</h1>
        <p className="text-slate-300 mt-2">Track your internship journey and manage applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-dark-card rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Applications</p>
              <p className="text-3xl font-bold text-white">{stats?.totalApplications || 0}</p>
            </div>
            <FiBriefcase className="h-12 w-12 text-primary-500 opacity-50" />
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm">+{stats?.thisMonthApplications || 0} this month</span>
          </div>
        </div>

        <div className="bg-dark-card rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Saved Jobs</p>
              <p className="text-3xl font-bold text-white">{stats?.savedJobs || 0}</p>
            </div>
            <FiBookmark className="h-12 w-12 text-yellow-500 opacity-50" />
          </div>
        </div>

        <div className="bg-dark-card rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Interviews</p>
              <p className="text-3xl font-bold text-white">{stats?.interviews || 0}</p>
            </div>
            <FiCheckCircle className="h-12 w-12 text-green-500 opacity-50" />
          </div>
        </div>

        <div className="bg-dark-card rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Profile Views</p>
              <p className="text-3xl font-bold text-white">{stats?.profileViews || 0}</p>
            </div>
            <FiEye className="h-12 w-12 text-purple-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-dark-card rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Application Trends</h2>
          <Bar data={monthlyData} options={chartOptions} />
        </div>

        <div className="bg-dark-card rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Application Status</h2>
          <div className="max-w-sm mx-auto">
            <Doughnut data={statusData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Applications */}
        <div className="bg-dark-card rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Applications</h2>
            <Link to="/student/applied-jobs" className="text-primary-600 hover:text-primary-700 text-sm">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {appliedJobs?.data?.length > 0 ? (
              appliedJobs.data.slice(0, 5).map((application) => (
                <div key={application._id} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-white">{application.jobTitle}</h3>
                      <p className="text-sm text-slate-300">{application.company}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Applied: {new Date(application.appliedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      application.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                      application.status === 'interview' ? 'bg-purple-100 text-purple-800' :
                      application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {application.status?.charAt(0).toUpperCase() + application.status?.slice(1) || 'Pending'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                title="No applications yet"
                message="Start applying for internships to see them here"
                actionText="Browse Jobs"
                actionLink="/browse-jobs"
              />
            )}
          </div>
        </div>

        {/* Saved Jobs */}
        <div className="bg-dark-card rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Saved Jobs</h2>
            <Link to="/student/saved-jobs" className="text-primary-600 hover:text-primary-700 text-sm">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {savedJobs?.data?.length > 0 ? (
              savedJobs.data.slice(0, 5).map((job) => (
                <div key={job._id} className="border-b pb-4 last:border-0">
                  <Link to={`/jobs/${job._id}`} className="block hover:bg-dark-base transition p-2 rounded">
                    <h3 className="font-semibold text-white">{job.jobTitle}</h3>
                    <p className="text-sm text-slate-300">{job.company}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span>{job.location?.city}</span>
                      <span>•</span>
                      <span>Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</span>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <EmptyState
                title="No saved jobs"
                message="Save interesting internships to apply later"
                actionText="Browse Jobs"
                actionLink="/browse-jobs"
              />
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/browse-jobs"
          className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl p-6 hover:shadow-lg transition transform hover:scale-105"
        >
          <FiBriefcase className="h-8 w-8 mb-2" />
          <h3 className="text-lg font-semibold">Find Internships</h3>
          <p className="text-sm opacity-90 mt-1">Browse available opportunities</p>
        </Link>

        <Link
          to="/student/profile"
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6 hover:shadow-lg transition transform hover:scale-105"
        >
          <FiUser className="h-8 w-8 mb-2" />
          <h3 className="text-lg font-semibold">Update Profile</h3>
          <p className="text-sm opacity-90 mt-1">Enhance your profile visibility</p>
        </Link>

        <Link
          to="/student/applied-jobs"
          className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 hover:shadow-lg transition transform hover:scale-105"
        >
          <FiClock className="h-8 w-8 mb-2" />
          <h3 className="text-lg font-semibold">Track Applications</h3>
          <p className="text-sm opacity-90 mt-1">Check application status</p>
        </Link>
      </div>
    </div>
  );
};

export default StudentDashboard;