import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStudent } from '../../hooks/useStudent';
import { FiEye, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import Loader from '../common/Loader';
import EmptyState from '../common/EmptyState';
import Pagination from '../common/Pagination';

const AppliedJobs = () => {
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const { useAppliedJobs } = useStudent();
  const { data, isLoading } = useAppliedJobs({ status: status !== 'all' ? status : undefined, page, limit: 10 });

  if (isLoading) return <Loader />;

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewed: 'bg-blue-100 text-blue-800',
      interview: 'bg-purple-100 text-purple-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-dark-base text-slate-100';
  };

  const getStatusIcon = (status) => {
    if (status === 'interview') return <FiEye className="inline mr-1" />;
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">My Applications</h1>
        <p className="text-slate-300 mt-2">Track and manage your internship applications</p>
      </div>

      {/* Status Filter */}
      <div className="bg-dark-card rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'reviewed', 'interview', 'accepted', 'rejected'].map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatus(s);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg capitalize transition ${
                status === s
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-base text-slate-200 hover:bg-dark-card'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      {data?.data?.length === 0 ? (
        <EmptyState
          title="No applications found"
          message="You haven't applied for any internships yet. Start exploring opportunities!"
          actionText="Browse Jobs"
          actionLink="/browse-jobs"
        />
      ) : (
        <div className="space-y-4">
          {data?.data?.map((application) => (
            <div key={application._id} className="bg-dark-card rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <Link to={`/jobs/${application.jobId}`} className="block">
                    <h2 className="text-xl font-semibold text-white hover:text-primary-600">
                      {application.jobTitle}
                    </h2>
                  </Link>
                  <p className="text-slate-300 mt-1">{application.company}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-400">
                    <span>{application.location?.city}</span>
                    <span>•</span>
                    <span>Applied: {new Date(application.appliedDate).toLocaleDateString()}</span>
                    {application.interviewDate && (
                      <>
                        <span>•</span>
                        <span className="text-purple-600">Interview: {new Date(application.interviewDate).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                  {application.coverLetter && (
                    <details className="mt-3">
                      <summary className="text-sm text-primary-600 cursor-pointer hover:text-primary-700">
                        View Cover Letter
                      </summary>
                      <p className="mt-2 text-slate-300 text-sm bg-dark-base p-3 rounded">
                        {application.coverLetter}
                      </p>
                    </details>
                  )}
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                    {getStatusIcon(application.status)}
                    {application.status?.charAt(0).toUpperCase() + application.status?.slice(1)}
                  </span>
                  {application.status === 'interview' && application.interviewDate && (
                    <div className="mt-2 text-xs text-slate-400">
                      <FiEye className="inline mr-1" />
                      Interview scheduled
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {data?.pagination && data.pagination.pages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={data.pagination.pages}
              onPageChange={setPage}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;