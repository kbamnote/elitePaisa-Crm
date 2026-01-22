/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { loanTypesAPI } from '../services/api';
import { 
  CreditCardIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  FunnelIcon, 
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon
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

  // Load loan types from API
  useEffect(() => {
    const fetchLoanTypes = async () => {
      try {
        setLoading(true);
        const response = await loanTypesAPI.getAll(filters);
        setLoanTypes(response.data.loanTypes || []);
      } catch (error) {
        console.error('Error fetching loan types:', error);
        // Set empty array on error
        setLoanTypes([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLoanTypes();
  }, [JSON.stringify(filters)]); // Convert filters to string for comparison

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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
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
        // Update existing loan type
        console.log('Updating loan type:', currentLoanType._id, formData);
        await loanTypesAPI.update(currentLoanType._id, formData);
      } else {
        // Create new loan type
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
        // Refresh the data
        const response = await loanTypesAPI.getAll(filters);
        setLoanTypes(response.data.loanTypes || []);
      } catch (error) {
        console.error('Error deleting loan type:', error);
        alert('Error deleting loan type: ' + error.response?.data?.message || error.message);
      }
    }
  };

  // Apply filters
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
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <XCircleIcon className="h-4 w-4 text-red-500" />;
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



  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Loan Types</h1>
          <p className="mt-1 text-sm text-gray-500">Manage different loan products offered by ElitePaisa</p>
        </div>
        <button
          onClick={openAddModal}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add Loan Type
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search loan types..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          <select
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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

          <select
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button
            onClick={resetFilters}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Loan Types Table */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loan Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount Range
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interest Rate
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tenure
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLoanTypes.length > 0 ? (
                filteredLoanTypes.map((loanType) => (
                  <tr key={loanType._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{loanType.loanName}</div>
                      <div className="text-sm text-gray-500">{loanType._id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getCategoryLabel(loanType.loanCategory)}</div>
                      <div className="text-sm text-gray-500">{loanType.loanSubcategory}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(loanType.minAmount)} - {formatCurrency(loanType.maxAmount)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{loanType.interestRate?.min}% - {loanType.interestRate?.max}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{loanType.tenure?.minMonths} - {loanType.tenure?.maxMonths} months</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(loanType.status)}
                        <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(loanType.status)}`}>
                          {loanType.status.charAt(0).toUpperCase() + loanType.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(loanType)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(loanType._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    No loan types found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredLoanTypes.length}</span> of{' '}
                <span className="font-medium">{filteredLoanTypes.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-1" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Add/Edit Loan Type */}
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {currentLoanType ? 'Edit Loan Type' : 'Add New Loan Type'}
                    </h3>
                    <div className="mt-4">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label htmlFor="loanName" className="block text-sm font-medium text-gray-700">
                            Loan Name
                          </label>
                          <input
                            type="text"
                            name="loanName"
                            id="loanName"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={formData.loanName}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="loanCategory" className="block text-sm font-medium text-gray-700">
                              Category
                            </label>
                            <select
                              name="loanCategory"
                              id="loanCategory"
                              className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              value={formData.loanCategory}
                              onChange={handleInputChange}
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
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                              Status
                            </label>
                            <select
                              name="status"
                              id="status"
                              className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              value={formData.status}
                              onChange={handleInputChange}
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="minAmount" className="block text-sm font-medium text-gray-700">
                              Minimum Amount (₹)
                            </label>
                            <input
                              type="number"
                              name="minAmount"
                              id="minAmount"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              value={formData.minAmount}
                              onChange={handleInputChange}
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="maxAmount" className="block text-sm font-medium text-gray-700">
                              Maximum Amount (₹)
                            </label>
                            <input
                              type="number"
                              name="maxAmount"
                              id="maxAmount"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              value={formData.maxAmount}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="interestRate.min" className="block text-sm font-medium text-gray-700">
                              Min Interest Rate (%)
                            </label>
                            <input
                              type="number"
                              name="interestRate.min"
                              id="interestRate.min"
                              step="0.1"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              value={formData.interestRate.min}
                              onChange={handleInputChange}
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="interestRate.max" className="block text-sm font-medium text-gray-700">
                              Max Interest Rate (%)
                            </label>
                            <input
                              type="number"
                              name="interestRate.max"
                              id="interestRate.max"
                              step="0.1"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              value={formData.interestRate.max}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="tenure.minMonths" className="block text-sm font-medium text-gray-700">
                              Min Tenure (months)
                            </label>
                            <input
                              type="number"
                              name="tenure.minMonths"
                              id="tenure.minMonths"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              value={formData.tenure.minMonths}
                              onChange={handleInputChange}
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="tenure.maxMonths" className="block text-sm font-medium text-gray-700">
                              Max Tenure (months)
                            </label>
                            <input
                              type="number"
                              name="tenure.maxMonths"
                              id="tenure.maxMonths"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              value={formData.tenure.maxMonths}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="processingFee" className="block text-sm font-medium text-gray-700">
                            Processing Fee
                          </label>
                          <input
                            type="text"
                            name="processingFee"
                            id="processingFee"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={formData.processingFee}
                            onChange={handleInputChange}
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {currentLoanType ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanTypes;