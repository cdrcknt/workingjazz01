import React, { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { Pencil, Trash2, Search } from 'lucide-react';

const UpdateRecords = () => {
  const [activeTab, setActiveTab] = useState('employees');
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRecord, setEditingRecord] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, [activeTab]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from(activeTab)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (record) => {
    try {
      const { error } = await supabase
        .from(activeTab)
        .update(record)
        .eq('id', record.id);

      if (error) throw error;
      setEditingRecord(null);
      fetchRecords();
    } catch (error) {
      console.error(`Error updating ${activeTab}:`, error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    
    try {
      const { error } = await supabase
        .from(activeTab)
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchRecords();
    } catch (error) {
      console.error(`Error deleting ${activeTab}:`, error);
    }
  };

  const filteredRecords = records.filter(record => {
    const searchString = searchTerm.toLowerCase();
    return activeTab === 'employees'
      ? record.name.toLowerCase().includes(searchString) || 
        record.email.toLowerCase().includes(searchString)
      : record.name.toLowerCase().includes(searchString) || 
        record.product_id.toLowerCase().includes(searchString);
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Update Records</h3>
        <p className="text-gray-600">Manage and update system records</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setActiveTab('employees')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'employees'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Employees
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'products'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Products
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <div className="mt-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading records...</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredRecords.map((record) => (
                  <div
                    key={record.id}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    {editingRecord?.id === record.id ? (
                      <div className="space-y-4">
                        {activeTab === 'employees' ? (
                          <>
                            <input
                              type="text"
                              value={editingRecord.name}
                              onChange={(e) => setEditingRecord({
                                ...editingRecord,
                                name: e.target.value
                              })}
                              className="w-full p-2 border rounded"
                              placeholder="Name"
                            />
                            <input
                              type="email"
                              value={editingRecord.email}
                              onChange={(e) => setEditingRecord({
                                ...editingRecord,
                                email: e.target.value
                              })}
                              className="w-full p-2 border rounded"
                              placeholder="Email"
                            />
                            <select
                              value={editingRecord.role}
                              onChange={(e) => setEditingRecord({
                                ...editingRecord,
                                role: e.target.value
                              })}
                              className="w-full p-2 border rounded"
                            >
                              <option value="Barista">Barista</option>
                              <option value="Cashier">Cashier</option>
                              <option value="Manager">Manager</option>
                              <option value="Supervisor">Supervisor</option>
                            </select>
                          </>
                        ) : (
                          <>
                            <input
                              type="text"
                              value={editingRecord.name}
                              onChange={(e) => setEditingRecord({
                                ...editingRecord,
                                name: e.target.value
                              })}
                              className="w-full p-2 border rounded"
                              placeholder="Product Name"
                            />
                            <input
                              type="number"
                              value={editingRecord.price}
                              onChange={(e) => setEditingRecord({
                                ...editingRecord,
                                price: parseFloat(e.target.value)
                              })}
                              className="w-full p-2 border rounded"
                              placeholder="Price"
                            />
                            <select
                              value={editingRecord.category}
                              onChange={(e) => setEditingRecord({
                                ...editingRecord,
                                category: e.target.value
                              })}
                              className="w-full p-2 border rounded"
                            >
                              <option value="Coffee">Coffee</option>
                              <option value="Milktea">Milktea</option>
                              <option value="Frappe">Frappe</option>
                              <option value="Non-Coffee">Non-Coffee</option>
                            </select>
                          </>
                        )}
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setEditingRecord(null)}
                            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleUpdate(editingRecord)}
                            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{record.name}</h4>
                          <p className="text-gray-500 text-sm">
                            {activeTab === 'employees'
                              ? `${record.email} • ${record.role}`
                              : `${record.product_id} • $${record.price}`}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingRecord(record)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(record.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}
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

export default UpdateRecords;