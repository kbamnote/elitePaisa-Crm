import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loanApplicationsAPI } from '../../services/api';
import { 
  DocumentTextIcon, 
  FunnelIcon, 
  MagnifyingGlassIcon, 
  ChevronUpDownIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  ArrowPathIcon,
  UserCircleIcon,
  CalendarIcon,
  BanknotesIcon,
  ChartBarIcon,
  ArrowsPointingOutIcon
} from '@heroicons/react/24/outline';

const LoanApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    loanType: '',
    search: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 1
  });
  
  // Helper function to get nested object values
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  // Load loan applications from API
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await loanApplicationsAPI.getAll({ ...filters, page: pagination.currentPage, limit: pagination.itemsPerPage });
        setApplications(response.data.loanApplications || []);
        setPagination(prev => ({
          ...prev,
          totalPages: Math.ceil(response.data.totalCount / pagination.itemsPerPage)
        }));
      } catch (error) {
        console.error('Error fetching loan applications:', error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplications();
  }, [JSON.stringify(filters), pagination.currentPage, pagination.itemsPerPage]);

  // Apply filters, sorting, and pagination
  const sortedApplications = [...applications].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = getNestedValue(a, sortConfig.key);
    const bValue = getNestedValue(b, sortConfig.key);
    
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
  
  // Apply filters
  const filteredApplications = sortedApplications.filter(application => {
    if (filters.status && application.applicationStatus !== filters.status) {
      return false;
    }
    
    if (filters.loanType && application.loanTypeId?.loanSubcategory !== filters.loanType) {
      return false;
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!application.authId?.fullName?.toLowerCase().includes(searchLower) &&
          !application.authId?.email?.toLowerCase().includes(searchLower) &&
          !application._id?.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    
    return true;
  });
  
  // Apply pagination
  const paginatedApplications = filteredApplications.slice(
    (pagination.currentPage - 1) * pagination.itemsPerPage,
    pagination.currentPage * pagination.itemsPerPage
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'disbursed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-4 w-4" />;
      case 'approved':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'rejected':
        return <XCircleIcon className="h-4 w-4" />;
      case 'disbursed':
        return <CurrencyRupeeIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      status: '',
      loanType: '',
      search: ''
    });
  };
  
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const handleItemsPerPageChange = (items) => {
    setPagination(prev => ({
      ...prev,
      itemsPerPage: parseInt(items),
      currentPage: 1 // Reset to first page when changing items per page
    }));
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const response = await loanApplicationsAPI.getAll({ ...filters, page: pagination.currentPage, limit: pagination.itemsPerPage });
      setApplications(response.data.loanApplications || []);
      setPagination(prev => ({
        ...prev,
        totalPages: Math.ceil(response.data.totalCount / pagination.itemsPerPage)
      }));
    } catch (error) {
      console.error('Error refreshing applications:', error);
    } finally {
      setLoading(false);
    }
  };
  

  
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({
        ...prev,
        currentPage: page
      }));
    }
  };
  

  
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  // Calculate stats
  const stats = {
    total: filteredApplications.length,
    pending: filteredApplications.filter(a => a.applicationStatus === 'pending').length,
    approved: filteredApplications.filter(a => a.applicationStatus === 'approved').length,
    rejected: filteredApplications.filter(a => a.applicationStatus === 'rejected').length,
    disbursed: filteredApplications.filter(a => a.applicationStatus === 'disbursed').length
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
        <p className="mt-4 text-sm text-gray-500">Loading applications...</p>
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
              <DocumentTextIcon className="h-8 w-8 text-white" />
            </div>
            Loan Applications
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage and track all loan applications from customers
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

      {/* Stats Cards */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Applications</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{stats.total}</p>
            </div>
            <DocumentTextIcon className="h-12 w-12 text-blue-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-600">Pending</p>
              <p className="text-3xl font-bold text-amber-900 mt-2">{stats.pending}</p>
            </div>
            <ClockIcon className="h-12 w-12 text-amber-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Approved</p>
              <p className="text-3xl font-bold text-green-900 mt-2">{stats.approved}</p>
            </div>
            <CheckCircleIcon className="h-12 w-12 text-green-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Rejected</p>
              <p className="text-3xl font-bold text-red-900 mt-2">{stats.rejected}</p>
            </div>
            <XCircleIcon className="h-12 w-12 text-red-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-cyan-600">Disbursed</p>
              <p className="text-3xl font-bold text-cyan-900 mt-2">{stats.disbursed}</p>
            </div>
            <BanknotesIcon className="h-12 w-12 text-cyan-400" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
              placeholder="Search by ID, name, email..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          <select
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-shadow"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="disbursed">Disbursed</option>
          </select>

          <select
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-shadow"
            value={filters.loanType}
            onChange={(e) => handleFilterChange('loanType', e.target.value)}
          >
            <option value="">All Loan Types</option>
            <option value="personal">Personal</option>
            <option value="home">Home</option>
            <option value="vehicle">Vehicle</option>
            <option value="business">Business</option>
            <option value="education">Education</option>
          </select>

          <button
            onClick={resetFilters}
            className="px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors inline-flex items-center justify-center gap-2"
          >
            <FunnelIcon className="h-4 w-4" />
            Reset Filters
          </button>
        </div>
      </div>

      {/* Applications Table */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors">
                  <div className="flex items-center gap-1" onClick={() => handleSort('_id')}>
                    Application
                    {sortConfig.key === '_id' && (
                      sortConfig.direction === 'asc' ? 
                        <ChevronUpIcon className="h-4 w-4" /> : 
                        <ChevronDownIcon className="h-4 w-4" />
                    )}
                    {sortConfig.key !== '_id' && <ChevronUpDownIcon className="h-4 w-4" />}
                  </div>
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors">
                  <div className="flex items-center gap-1" onClick={() => handleSort('authId.fullName')}>
                    Customer
                    {sortConfig.key === 'authId.fullName' && (
                      sortConfig.direction === 'asc' ? 
                        <ChevronUpIcon className="h-4 w-4" /> : 
                        <ChevronDownIcon className="h-4 w-4" />
                    )}
                    {sortConfig.key !== 'authId.fullName' && <ChevronUpDownIcon className="h-4 w-4" />}
                  </div>
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors">
                  <div className="flex items-center gap-1" onClick={() => handleSort('loanTypeId.loanName')}>
                    Loan Details
                    {sortConfig.key === 'loanTypeId.loanName' && (
                      sortConfig.direction === 'asc' ? 
                        <ChevronUpIcon className="h-4 w-4" /> : 
                        <ChevronDownIcon className="h-4 w-4" />
                    )}
                    {sortConfig.key !== 'loanTypeId.loanName' && <ChevronUpDownIcon className="h-4 w-4" />}
                  </div>
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors">
                  <div className="flex items-center gap-1" onClick={() => handleSort('loanAmount')}>
                    Financials
                    {sortConfig.key === 'loanAmount' && (
                      sortConfig.direction === 'asc' ? 
                        <ChevronUpIcon className="h-4 w-4" /> : 
                        <ChevronDownIcon className="h-4 w-4" />
                    )}
                    {sortConfig.key !== 'loanAmount' && <ChevronUpDownIcon className="h-4 w-4" />}
                  </div>
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors">
                  <div className="flex items-center gap-1" onClick={() => handleSort('applicationStatus')}>
                    Status
                    {sortConfig.key === 'applicationStatus' && (
                      sortConfig.direction === 'asc' ? 
                        <ChevronUpIcon className="h-4 w-4" /> : 
                        <ChevronDownIcon className="h-4 w-4" />
                    )}
                    {sortConfig.key !== 'applicationStatus' && <ChevronUpDownIcon className="h-4 w-4" />}
                  </div>
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors">
                  <div className="flex items-center gap-1" onClick={() => handleSort('appliedAt')}>
                    Applied Date
                    {sortConfig.key === 'appliedAt' && (
                      sortConfig.direction === 'asc' ? 
                        <ChevronUpIcon className="h-4 w-4" /> : 
                        <ChevronDownIcon className="h-4 w-4" />
                    )}
                    {sortConfig.key !== 'appliedAt' && <ChevronUpDownIcon className="h-4 w-4" />}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedApplications.length > 0 ? (
                paginatedApplications.map((application) => (
                  <React.Fragment key={application._id}>
                    <tr className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-colors cursor-pointer sm:hidden">
                      <td className="px-6 py-4 whitespace-nowrap" colSpan="6">
                        <Link to={`/loan-applications/${application._id}`} className="block">
                          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                  <DocumentTextIcon className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-gray-900">#{application._id?.substring(0, 8)}</div>
                                  <div className="text-xs text-gray-500 font-mono">{application._id?.substring(8, 16)}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(application.applicationStatus)}`}>
                                  {getStatusIcon(application.applicationStatus)}
                                  {application.applicationStatus?.charAt(0).toUpperCase() + application.applicationStatus?.slice(1)}
                                </span>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div>
                                <span className="text-xs text-gray-500">Customer:</span>
                                <div className="text-sm font-semibold">{application.authId?.fullName || 'N/A'}</div>
                                <div className="text-xs text-gray-500">{application.authId?.email || 'N/A'}</div>
                              </div>
                              
                              <div>
                                <span className="text-xs text-gray-500">Loan:</span>
                                <div className="text-sm font-semibold">{application.loanTypeId?.loanName || 'N/A'}</div>
                                <div className="text-xs text-gray-500">Tenure: {application.tenure} months</div>
                              </div>
                              
                              <div>
                                <span className="text-xs text-gray-500">Amount:</span>
                                <div className="text-sm font-semibold flex items-center gap-1">
                                  <CurrencyRupeeIcon className="h-4 w-4 text-green-600" />
                                  {formatCurrency(application.loanAmount || 0)}
                                </div>
                              </div>
                              
                              <div className="flex justify-between text-xs">
                                <div>
                                  <span className="text-gray-500">Applied:</span>
                                  <div>{formatDate(application.appliedAt)}</div>
                                </div>
                                <div>
                                  <span className="text-gray-500">Credit:</span>
                                  <div>{application.creditScore || 'N/A'}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </td>
                    </tr>
                    
                    <tr className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-colors cursor-pointer hidden sm:table-row">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link to={`/loan-applications/${application._id}`} className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-100 rounded-lg">
                            <DocumentTextIcon className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">#{application._id?.substring(0, 8)}</div>
                            <div className="text-xs text-gray-500 font-mono">{application._id?.substring(8, 16)}</div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link to={`/loan-applications/${application._id}`} className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                            <UserCircleIcon className="h-6 w-6 text-indigo-600" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{application.authId?.fullName || 'N/A'}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <span>{application.authId?.email || 'N/A'}</span>
                            </div>
                            <div className="text-xs text-gray-500">{application.authId?.phoneNo || 'N/A'}</div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link to={`/loan-applications/${application._id}`} className="text-sm">
                          <div className="font-semibold text-gray-900 mb-1">{application.loanTypeId?.loanName || 'N/A'}</div>
                          <div className="text-xs text-gray-600 flex items-center gap-1 mb-0.5">
                            <CalendarIcon className="h-3 w-3" />
                            Tenure: {application.tenure} months
                          </div>
                          <div className="text-xs text-gray-500">Purpose: {application.purpose || 'N/A'}</div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link to={`/loan-applications/${application._id}`} className="text-sm">
                          <div className="font-semibold text-gray-900 mb-1 flex items-center gap-1">
                            <CurrencyRupeeIcon className="h-4 w-4 text-green-600" />
                            {formatCurrency(application.loanAmount || 0)}
                          </div>
                          <div className="text-xs text-gray-600 mb-0.5">
                            Income: {formatCurrency(application.monthlyIncome || 0)}/mo
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <ChartBarIcon className="h-3 w-3" />
                            Credit: {application.creditScore || 'N/A'}
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Link to={`/loan-applications/${application._id}`} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(application.applicationStatus)}`}>
                            {getStatusIcon(application.applicationStatus)}
                            {application.applicationStatus?.charAt(0).toUpperCase() + application.applicationStatus?.slice(1)}
                          </Link>

                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link to={`/loan-applications/${application._id}`} className="text-sm text-gray-900">{formatDate(application.appliedAt)}</Link>
                      </td>
                    </tr>
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your search or filter criteria.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {(paginatedApplications.length > 0 || pagination.totalPages > 1) && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button 
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button 
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <label htmlFor="items-per-page" className="text-sm text-gray-700 mr-2">Show:</label>
                  <select
                    id="items-per-page"
                    value={pagination.itemsPerPage}
                    onChange={(e) => handleItemsPerPageChange(e.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                  </select>
                </div>
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(pagination.currentPage - 1) * pagination.itemsPerPage + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.currentPage * pagination.itemsPerPage, filteredApplications.length)}
                    </span> of{' '}
                    <span className="font-medium">{filteredApplications.length}</span> results
                  </p>
                </div>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px" aria-label="Pagination">
                  <button 
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage <= 1}
                    className="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>
                  
                  {/* Page numbers */}
                  {getPageNumbers().map(pageNumber => (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pageNumber === pagination.currentPage ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'}`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                  
                  <button 
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage >= pagination.totalPages}
                    className="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanApplications;