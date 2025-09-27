import React from 'react';
import { Link } from 'react-router-dom';

const getStatusColor = (status) => {
  switch (status) {
    case 'FILED':
      return 'bg-blue-100 text-blue-800';
    case 'IN_PROGRESS':
      return 'bg-yellow-100 text-yellow-800';
    case 'RESOLVED':
      return 'bg-green-100 text-green-800';
    case 'REJECTED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function ReportCard({ complaint }) {
  // Format the date for better readability
  const formattedDate = new Date(complaint.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Link to={`/report/${complaint.id}`} className="block border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white p-5">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-lg text-gray-800 mb-2 pr-2">{complaint.title}</h3>
        <span
          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getStatusColor(complaint.status)}`}
        >
          {complaint.status.replace('_', ' ')}
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-4 h-10 overflow-hidden">{complaint.description}</p>
      <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-3">
        <span>ID: #{complaint.id}</span>
        <span>{formattedDate}</span>
      </div>
    </Link>
  );
}