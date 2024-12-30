import React from 'react';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';

const ReportActions = ({ onDownload, isLoading }) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onDownload('pdf')}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
      >
        <FileText className="w-4 h-4" />
        <span>PDF</span>
      </button>
      <button
        onClick={() => onDownload('excel')}
        disabled={isLoading}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
      >
        <FileSpreadsheet className="w-4 h-4" />
        <span>Excel</span>
      </button>
      <button
        onClick={() => onDownload('csv')}
        disabled={isLoading}
        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
      >
        <Download className="w-4 h-4" />
        <span>CSV</span>
      </button>
    </div>
  );
};

export default ReportActions;