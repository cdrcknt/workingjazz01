import React from 'react';

const ReportHeader = ({ title, subtitle, color = 'blue' }) => {
  return (
    <div className={`bg-gradient-to-r from-${color}-50 to-${color}-100 rounded-xl p-6 mb-6`}>
      <h3 className={`text-xl font-semibold text-${color}-800 mb-2`}>{title}</h3>
      <p className={`text-${color}-600`}>{subtitle}</p>
    </div>
  );
};

export default ReportHeader;