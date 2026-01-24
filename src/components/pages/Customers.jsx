import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customersAPI } from '../../services/api';
import DeleteModal from '../common/modals/DeleteModal';
import SuccessModal from '../common/modals/SuccessModal';
import { 
  UserGroupIcon, 
  MagnifyingGlassIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  MapPinIcon,
  UserCircleIcon,
  TrashIcon,
  EyeIcon,
  FunnelIcon,
  ArrowPathIcon,
  CheckBadgeIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [filters, setFilters] = useState({
    search: ''
  });
  const navigate = useNavigate();

  // Load customers from API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        console.log('Fetching customers with filters:', filters);
        const response = await customersAPI.getAll(filters);
        console.log('API Response:', response);
        const userData = response.data.profiles || [];
        setCustomers(userData);
      } catch (error) {
        console.error('Error fetching customers:', error);
        console.error('Error details:', error.response || error.message);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomers();
  }, [JSON.stringify(filters)]);

  // Apply filters
  const filteredCustomersData = customers.filter(customer => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!customer.fullName?.toLowerCase().includes(searchLower) &&
          !customer.email?.toLowerCase().includes(searchLower) &&
          !customer.phoneNo?.includes(filters.search) &&
          !customer.authId?.email?.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckBadgeIcon className="h-4 w-4" />;
      case 'inactive':
        return <XCircleIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleFilterChange = (value) => {
    setFilters(prev => ({
      ...prev,
      search: value
    }));
  };

  const handleViewCustomer = (customerId) => {
    navigate(`/customers/${customerId}`);
  };

  const handleDeleteCustomer = (customerId) => {
    const customer = customers.find(c => (c._id || c.id || c.authId?._id || c.authId?.id) === customerId);
    setCustomerToDelete(customer);
    setShowDeleteModal(true);
  };

  const confirmDeleteCustomer = async () => {
    if (!customerToDelete) return;
    
    const customerId = customerToDelete._id || customerToDelete.id || customerToDelete.authId?._id || customerToDelete.authId?.id;
    
    try {
      setDeletingId(customerId);
      console.log('Attempting to delete customer with ID:', customerId);
      
      const response = await customersAPI.delete(customerId);
      console.log('Delete response:', response.data);
      
      setCustomers(prev => prev.filter(customer => 
        (customer._id || customer.id || customer.authId?._id || customer.authId?.id) !== customerId
      ));
      
      setShowDeleteModal(false);
      setCustomerToDelete(null);
      
      setSuccessMessage('Customer deleted successfully!');
      setShowSuccessModal(true);
      
      setTimeout(async () => {
        try {
          const refreshResponse = await customersAPI.getAll(filters);
          const userData = refreshResponse.data.profiles || [];
          setCustomers(userData);
        } catch (refreshError) {
          console.error('Error refreshing customer list:', refreshError);
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error deleting customer:', error);
      
      let errorMessage = 'Unknown error';
      if (error.response) {
        errorMessage = error.response.data?.message || `HTTP ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        errorMessage = 'Network error: Unable to reach server';
      } else {
        errorMessage = error.message;
      }
      
      alert(`Failed to delete customer. Error: ${errorMessage}`);
    } finally {
      setDeletingId(null);
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setCustomerToDelete(null);
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const response = await customersAPI.getAll(filters);
      const userData = response.data.profiles || [];
      setCustomers(userData);
    } catch (error) {
      console.error('Error refreshing customers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
        <p className="mt-4 text-sm text-gray-500">Loading customers...</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
              <UserGroupIcon className="h-8 w-8 text-white" />
            </div>
            Users & Customers
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage all registered users and customer profiles
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <ArrowPathIcon className="h-5 w-5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Search Bar with Stats */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
            placeholder="Search by name, email, phone number..."
            value={filters.search}
            onChange={(e) => handleFilterChange(e.target.value)}
          />
        </div>
        
        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Customers</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{customers.length}</p>
              </div>
              <UserGroupIcon className="h-10 w-10 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Active Users</p>
                <p className="text-2xl font-bold text-green-900 mt-1">
                  {customers.filter(c => (c.status || c.role) === 'active').length}
                </p>
              </div>
              <CheckBadgeIcon className="h-10 w-10 text-green-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Search Results</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{filteredCustomersData.length}</p>
              </div>
              <FunnelIcon className="h-10 w-10 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Identity
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomersData.length > 0 ? (
                filteredCustomersData.map((customer, index) => {
                  const customerId = customer._id || customer.id || customer.authId?._id || customer.authId?.id;
                  const fullName = customer.fullName || customer.name || customer.authId?.fullName || customer.authId?.name || 'N/A';
                  const email = customer.email || customer.authId?.email || 'N/A';
                  const phone = customer.phoneNo || customer.phoneNumber || customer.authId?.phoneNo || customer.authId?.phoneNumber || 'N/A';
                  const panNo = customer.panNo || customer.panNumber || customer.authId?.panNo || customer.authId?.panNumber || 'N/A';
                  const adharNo = customer.adharNo || customer.aadhaarNumber || customer.authId?.adharNo || customer.authId?.aadhaarNumber || 'N/A';
                  const status = customer.status || customer.role || customer.authId?.status || customer.authId?.role || 'active';
                  const createdAt = customer.createdAt || customer.registeredAt || customer.authId?.createdAt || customer.authId?.registeredAt;
                  
                  return (
                    <tr 
                      key={customerId || index} 
                      className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-colors cursor-pointer"
                      onClick={() => handleViewCustomer(customerId)}
                    >
                      {/* User Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {customer.profilePic ? (
                              <img
                                src={customer.profilePic}
                                alt="Profile"
                                className="h-12 w-12 rounded-full object-cover border-2 border-indigo-100 shadow-sm"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                                <UserCircleIcon className="h-8 w-8 text-indigo-600" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{fullName}</div>
                            <div className="text-xs text-gray-500 font-mono">ID: {customerId?.substring(0, 8)}</div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Contact Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900 mb-1">
                          <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="truncate max-w-xs">{email}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                          {phone}
                        </div>
                      </td>
                      
                      {/* Identity Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="text-gray-900 font-medium mb-1">PAN: <span className="font-mono">{panNo}</span></div>
                          <div className="text-gray-600">Aadhaar: <span className="font-mono text-xs">{adharNo.replace(/(\d{4})/g, '$1 ')}</span></div>
                        </div>
                      </td>
                      
                      {/* Date Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(createdAt)}</div>
                        {customer.updatedAt && (
                          <div className="text-xs text-gray-500">Updated: {formatDate(customer.updatedAt)}</div>
                        )}
                      </td>
                      
                      {/* Status Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(status)}`}>
                          {getStatusIcon(status)}
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </td>
                      
                      {/* Actions Column */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewCustomer(customerId);
                            }}
                            className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1 transition-colors"
                          >
                            <EyeIcon className="h-5 w-5" />
                            <span className="hidden xl:inline">View</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCustomer(customerId);
                            }}
                            disabled={deletingId === customerId}
                            className="text-red-600 hover:text-red-900 flex items-center gap-1 disabled:opacity-50 transition-colors"
                          >
                            {deletingId === customerId ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-200 border-t-red-600"></div>
                            ) : (
                              <>
                                <TrashIcon className="h-5 w-5" />
                                <span className="hidden xl:inline">Delete</span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No customers found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your search criteria.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredCustomersData.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredCustomersData.length}</span> of{' '}
                  <span className="font-medium">{filteredCustomersData.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteCustomer}
        title="Delete Customer"
        message={`Are you sure you want to delete ${customerToDelete?.fullName || customerToDelete?.name || customerToDelete?.authId?.fullName || customerToDelete?.authId?.name || 'this customer'}? This action cannot be undone.`}
        confirmText="Delete Customer"
        cancelText="Cancel"
        isLoading={deletingId !== null}
      />
      
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Success!"
        message={successMessage}
        confirmText="OK"
      />
    </div>
  );
};

export default Customers;