import { useState, useEffect } from 'react';
import { customersAPI } from '../services/api';
import { 
  UserGroupIcon, 
  MagnifyingGlassIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  MapPinIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: ''
  });

  // Load customers from API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        console.log('Fetching customers with filters:', filters);
        // Fetch users from the new profile endpoint
        const response = await customersAPI.getAll(filters);
        console.log('API Response:', response);
        // Handle the response structure: { success: true, profiles: [...] }
        const userData = response.data.profiles || [];
        console.log('Setting customers data:', userData);
        setCustomers(userData);
      } catch (error) {
        console.error('Error fetching customers:', error);
        console.error('Error details:', error.response || error.message);
        // Set empty array on error
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomers();
  }, [JSON.stringify(filters)]); // Convert filters to string for comparison

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
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users & Customers</h1>
        <p className="mt-1 text-sm text-gray-500">Manage all registered users and customers</p>
      </div>

      {/* Search */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search customers by name, email, or phone..."
            value={filters.search}
            onChange={(e) => handleFilterChange(e.target.value)}
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User/Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Identity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomersData.length > 0 ? (
                filteredCustomersData.map((customer, index) => (
                  <tr key={customer._id || customer.id || customer.authId?._id || customer.authId?.id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <UserCircleIcon className="h-10 w-10 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{customer.fullName || customer.name || customer.authId?.fullName || customer.authId?.name || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{customer._id || customer.id || customer.authId?._id || customer.authId?.id || 'N/A'}</div>
                          <div className="text-sm text-gray-500">Registered: {formatDate(customer.createdAt || customer.registeredAt || customer.authId?.createdAt || customer.authId?.registeredAt || 'N/A')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-400" />
                        {customer.email || customer.authId?.email || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <PhoneIcon className="h-4 w-4 mr-1 text-gray-400" />
                        {customer.phoneNo || customer.phoneNumber || customer.authId?.phoneNo || customer.authId?.phoneNumber || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">PAN: {customer.panNo || customer.panNumber || customer.authId?.panNo || customer.authId?.panNumber || 'N/A'}</div>
                      <div className="text-sm text-gray-500">Aadhaar: {(customer.adharNo || customer.aadhaarNumber || customer.authId?.adharNo || customer.authId?.aadhaarNumber)?.replace(/(\d{4})/g, '$1 ') || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1 text-gray-400" />
                        {customer.address?.addressLine || customer.address?.fullAddress || customer.authId?.address?.addressLine || customer.authId?.address?.fullAddress || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {customer.address?.city || customer.authId?.address?.city || 'N/A'}, {customer.address?.state || customer.authId?.address?.state || 'N/A'} - {customer.address?.pincode || customer.address?.zipCode || customer.authId?.address?.pincode || customer.authId?.address?.zipCode || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Total: {customer.totalLoans || customer.loanCount || 0}</div>
                      <div className="text-sm text-gray-500">Active: {customer.activeLoans || customer.activeLoanCount || 0}</div>
                      <div className="text-sm text-gray-900 font-medium">Disbursed: {formatCurrency(customer.totalDisbursed || customer.totalDisbursedAmount || 0)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(customer.status || customer.role || customer.authId?.status || customer.authId?.role || 'N/A')}`}>
                        {(customer.status || customer.role || customer.authId?.status || customer.authId?.role || 'N/A')?.charAt(0).toUpperCase() + (customer.status || customer.role || customer.authId?.status || customer.authId?.role || 'N/A')?.slice(1)}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No customers found matching your criteria.
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
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredCustomersData.length}</span> of{' '}
                <span className="font-medium">{filteredCustomersData.length}</span> results
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
    </div>
  );
};

export default Customers;