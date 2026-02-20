/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { loanTypesAPI } from '../../services/api';
import {
  CreditCardIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
  CurrencyRupeeIcon,
  CalendarIcon,
  PercentBadgeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const LoanTypes = () => {
  const [loanTypes, setLoanTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentLoanType, setCurrentLoanType] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    search: ''
  });

  // State for form handling
  const [formData, setFormData] = useState({
    loanName: '',
    loanCategory: 'personal',
    loanSubcategory: 'personal',
    minAmount: '',
    maxAmount: '',
    interestRate: { min: '', max: '' },
    tenure: { minMonths: '', maxMonths: '' },
    processingFee: '',
    eligibilityCriteria: '',
    requiredDocuments: [],
    status: 'active'
  });

  // Load loan types from API
  useEffect(() => {
    const fetchLoanTypes = async () => {
      try {
        setLoading(true);
        const response = await loanTypesAPI.getAll(filters);
        setLoanTypes(response.data.loanTypes || []);
      } catch (error) {
        console.error('Error fetching loan types:', error);
        setLoanTypes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLoanTypes();
  }, [filters.category, filters.status, filters.search]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log('Input change:', name, value);

    if (name.startsWith('interestRate.') || name.startsWith('tenure.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle document input changes
  const handleDocumentChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      requiredDocuments: value.split(',').map(doc => doc.trim()).filter(doc => doc)
    }));
  };

  // Open modal for adding new loan type
  const openAddModal = () => {
    console.log('Opening add modal');
    setCurrentLoanType(null);
    setFormData({
      loanName: '',
      loanCategory: 'personal',
      loanSubcategory: 'personal',
      minAmount: '',
      maxAmount: '',
      interestRate: { min: '', max: '' },
      tenure: { minMonths: '', maxMonths: '' },
      processingFee: '',
      eligibilityCriteria: '',
      requiredDocuments: [],
      status: 'active'
    });
    setShowModal(true);
  };

  // Open modal for editing existing loan type
  const openEditModal = (loanType) => {
    console.log('Opening edit modal for:', loanType);
    setCurrentLoanType(loanType);
    setFormData({
      loanName: loanType.loanName || '',
      loanCategory: loanType.loanCategory || 'personal',
      loanSubcategory: loanType.loanSubcategory || 'personal',
      minAmount: loanType.minAmount || '',
      maxAmount: loanType.maxAmount || '',
      interestRate: {
        min: loanType.interestRate?.min || '',
        max: loanType.interestRate?.max || ''
      },
      tenure: {
        minMonths: loanType.tenure?.minMonths || '',
        maxMonths: loanType.tenure?.maxMonths || ''
      },
      processingFee: loanType.processingFee || '',
      eligibilityCriteria: loanType.eligibilityCriteria || '',
      requiredDocuments: loanType.requiredDocuments || [],
      status: loanType.status || 'active'
    });
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setCurrentLoanType(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);

    // Validate required fields
    if (!formData.loanName.trim()) {
      alert('Please enter a loan name');
      return;
    }

    if (!formData.minAmount || !formData.maxAmount) {
      alert('Please enter both minimum and maximum amounts');
      return;
    }

    if (parseFloat(formData.minAmount) > parseFloat(formData.maxAmount)) {
      alert('Minimum amount cannot be greater than maximum amount');
      return;
    }

    try {
      if (currentLoanType) {
        console.log('Updating loan type:', currentLoanType._id, formData);
        await loanTypesAPI.update(currentLoanType._id, formData);
      } else {
        console.log('Creating loan type:', formData);
        await loanTypesAPI.create(formData);
      }

      // Refresh the data
      const response = await loanTypesAPI.getAll(filters);
      setLoanTypes(response.data.loanTypes || []);

      // Close modal
      closeModal();
    } catch (error) {
      console.error('Error saving loan type:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      alert('Error saving loan type: ' + (error.response?.data?.message || error.message || error));
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this loan type?')) {
      try {
        await loanTypesAPI.delete(id);
        const response = await loanTypesAPI.getAll(filters);
        setLoanTypes(response.data.loanTypes || []);
      } catch (error) {
        console.error('Error deleting loan type:', error);
        alert('Error deleting loan type: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      personal: 'Personal',
      home: 'Home',
      vehicle: 'Vehicle',
      business: 'Business',
      education: 'Education',
      agriculture: 'Agriculture',
      gold: 'Gold',
      other: 'Other'
    };
    return labels[category] || category;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'inactive':
        return <XCircleIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      status: '',
      search: ''
    });
  };

  const filteredLoanTypes = loanTypes.filter(loanType => {
    if (filters.category && loanType.loanCategory !== filters.category) {
      return false;
    }
    if (filters.status && loanType.status !== filters.status) {
      return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!loanType.loanName.toLowerCase().includes(searchLower) &&
          !loanType._id.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <CreditCardIcon className="h-8 w-8 text-indigo-600" />
            Loan Types
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage different loan products offered by ElitePaisa
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Loan Type
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mt-6 bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search loan types..."
              className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          <div>
            <select
              className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="personal">Personal</option>
              <option value="home">Home</option>
              <option value="vehicle">Vehicle</option>
              <option value="business">Business</option>
              <option value="education">Education</option>
              <option value="agriculture">Agriculture</option>
              <option value="gold">Gold</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <select
              className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <button
              type="button"
              onClick={resetFilters}
              className="w-full inline-flex justify-center items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Loan Types Table */}
      <div className="mt-6 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Loan Type
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Category
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Amount Range
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Interest Rate
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Tenure
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredLoanTypes.length > 0 ? (
                    filteredLoanTypes.map((loanType) => (
                      <tr key={loanType._id}>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <div className="font-medium text-gray-900">{loanType.loanName}</div>
                          <div className="text-gray-500">{loanType._id}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <div className="text-gray-900">{getCategoryLabel(loanType.loanCategory)}</div>
                          <div className="text-gray-500">{loanType.loanSubcategory}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatCurrency(loanType.minAmount)} - {formatCurrency(loanType.maxAmount)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {loanType.interestRate?.min}% - {loanType.interestRate?.max}%
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {loanType.tenure?.minMonths} - {loanType.tenure?.maxMonths} months
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(loanType.status)}`}>
                            {getStatusIcon(loanType.status)}
                            {loanType.status.charAt(0).toUpperCase() + loanType.status.slice(1)}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => openEditModal(loanType)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(loanType._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-3 py-8 text-center text-sm text-gray-500">
                        No loan types found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Modal for Add/Edit Loan Type */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white">
              <button
                onClick={closeModal}
                className="absolute right-6 top-6 p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold">
                {currentLoanType ? 'Edit Loan Type' : 'Add New Loan Type'}
              </h2>
              <p className="text-indigo-100 text-sm mt-1">
                Configure loan parameters and requirements
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 py-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Basic Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <DocumentTextIcon className="w-5 h-5 text-indigo-600" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loan Name
                    </label>
                    <input
                      type="text"
                      name="loanName"
                      value={formData.loanName}
                      onChange={handleInputChange}
                      placeholder="e.g., Home Loan Premium"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow outline-none text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="loanCategory"
                      value={formData.loanCategory}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow outline-none text-sm bg-white"
                    >
                      <option value="personal">Personal</option>
                      <option value="home">Home</option>
                      <option value="vehicle">Vehicle</option>
                      <option value="business">Business</option>
                      <option value="education">Education</option>
                      <option value="agriculture">Agriculture</option>
                      <option value="gold">Gold</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <div className="relative">
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow outline-none text-sm bg-white appearance-none"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      <div className={`absolute right-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full ${formData.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Loan Amount */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CurrencyRupeeIcon className="w-5 h-5 text-indigo-600" />
                  Loan Amount
                </h3>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                      <input
                        type="number"
                        name="minAmount"
                        value={formData.minAmount}
                        onChange={handleInputChange}
                        placeholder="50,000"
                        className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow outline-none text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                      <input
                        type="number"
                        name="maxAmount"
                        value={formData.maxAmount}
                        onChange={handleInputChange}
                        placeholder="10,00,000"
                        className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow outline-none text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Interest Rate */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <PercentBadgeIcon className="w-5 h-5 text-indigo-600" />
                  Interest Rate
                </h3>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Rate
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="interestRate.min"
                        value={formData.interestRate.min}
                        onChange={handleInputChange}
                        step="0.01"
                        placeholder="8.5"
                        className="w-full px-4 pr-10 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow outline-none text-sm"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Rate
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="interestRate.max"
                        value={formData.interestRate.max}
                        onChange={handleInputChange}
                        step="0.01"
                        placeholder="12.0"
                        className="w-full px-4 pr-10 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow outline-none text-sm"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tenure */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-indigo-600" />
                  Loan Tenure
                </h3>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Tenure
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="tenure.minMonths"
                        value={formData.tenure.minMonths}
                        onChange={handleInputChange}
                        placeholder="12"
                        className="w-full px-4 pr-20 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow outline-none text-sm"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">months</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Tenure
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="tenure.maxMonths"
                        value={formData.tenure.maxMonths}
                        onChange={handleInputChange}
                        placeholder="240"
                        className="w-full px-4 pr-20 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow outline-none text-sm"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">months</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Processing Fee */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Processing Fee
                </label>
                <input
                  type="text"
                  name="processingFee"
                  value={formData.processingFee}
                  onChange={handleInputChange}
                  placeholder="e.g., 1% of loan amount or ₹5,000"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow outline-none text-sm"
                />
                <p className="mt-1.5 text-xs text-gray-500">
                  Specify as percentage or fixed amount
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30 text-sm"
                >
                  {currentLoanType ? 'Update Loan Type' : 'Create Loan Type'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanTypes;