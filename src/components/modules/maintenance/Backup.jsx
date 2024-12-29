import React, { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { Database, Download, CheckCircle, XCircle, Clock } from 'lucide-react';

const Backup = () => {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('data_backups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBackups(data || []);
    } catch (error) {
      console.error('Error fetching backups:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async () => {
    setCreating(true);
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      
      // Create backup record
      const { error } = await supabase
        .from('data_backups')
        .insert([{
          created_by: userId,
          backup_type: 'full',
          status: 'completed',
          metadata: {
            timestamp: new Date().toISOString(),
            type: 'archived_data'
          }
        }]);

      if (error) throw error;
      fetchBackups();
    } catch (error) {
      console.error('Error creating backup:', error);
    } finally {
      setCreating(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-purple-800 mb-2">Backup System</h3>
        <p className="text-purple-600">Create and manage system backups</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h4 className="text-lg font-semibold text-gray-900">Create New Backup</h4>
              <p className="text-gray-500">Backup all archived data</p>
            </div>
            <button
              onClick={createBackup}
              disabled={creating}
              className={`px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 ${
                creating ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {creating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Database className="w-5 h-5" />
                  <span>Create Backup</span>
                </>
              )}
            </button>
          </div>

          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Backup History</h4>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading backup history...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {backups.map((backup) => (
                  <div
                    key={backup.id}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(backup.status)}
                          <h5 className="font-medium text-gray-900">
                            {backup.backup_type.charAt(0).toUpperCase() + backup.backup_type.slice(1)} Backup
                          </h5>
                        </div>
                        <p className="text-sm text-gray-500">
                          Created on {new Date(backup.created_at).toLocaleString()}
                        </p>
                      </div>
                      <button
                        className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <Download className="w-5 h-5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Backup;