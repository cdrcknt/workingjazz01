import React, { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { Search, Edit2, Trash2, Building2, Mail, Phone } from 'lucide-react';

const ManageSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingSupplier, setEditingSupplier] = useState(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('company_name');

      if (error) throw error;
      setSuppliers(data || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (supplier) => {
    try {
      const { error } = await supabase
        .from('suppliers')
        .update(supplier)
        .eq('id', supplier.id);

      if (error) throw error;
      setEditingSupplier(null);
      fetchSuppliers();
    } catch (error) {
      console.error('Error updating supplier:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this supplier?')) return;

    try {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchSuppliers();
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-emerald-800 mb-2">Manage Suppliers</h3>
        <p className="text-emerald-600">Update or remove supplier information</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading suppliers...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSuppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="bg-gray-50 rounded-lg border border-gray-100 p-4 hover:shadow-md transition-shadow"
              >
                {editingSupplier?.id === supplier.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={editingSupplier.company_name}
                        onChange={(e) => setEditingSupplier({
                          ...editingSupplier,
                          company_name: e.target.value
                        })}
                        className="p-2 border rounded"
                        placeholder="Company Name"
                      />
                      <input
                        type="text"
                        value={editingSupplier.contact_person}
                        onChange={(e) => setEditingSupplier({
                          ...editingSupplier,
                          contact_person: e.target.value
                        })}
                        className="p-2 border rounded"
                        placeholder="Contact Person"
                      />
                      <input
                        type="email"
                        value={editingSupplier.email}
                        onChange={(e) => setEditingSupplier({
                          ...editingSupplier,
                          email: e.target.value
                        })}
                        className="p-2 border rounded"
                        placeholder="Email"
                      />
                      <input
                        type="tel"
                        value={editingSupplier.phone}
                        onChange={(e) => setEditingSupplier({
                          ...editingSupplier,
                          phone: e.target.value
                        })}
                        className="p-2 border rounded"
                        placeholder="Phone"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingSupplier(null)}
                        className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdate(editingSupplier)}
                        className="px-4 py-2 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <Building2 className="h-5 w-5 text-emerald-500" />
                        <div>
                          <h4 className="font-medium text-gray-900">{supplier.company_name}</h4>
                          <p className="text-sm text-gray-500">{supplier.contact_person}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <span>{supplier.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="h-4 w-4" />
                          <span>{supplier.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingSupplier(supplier)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(supplier.id)}
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
  );
};

export default ManageSuppliers;