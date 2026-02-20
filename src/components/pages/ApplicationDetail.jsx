import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loanApplicationsAPI } from '../../services/api';
import { 
  ArrowLeftIcon, 
  DocumentTextIcon, 
  UserCircleIcon, 
  CurrencyRupeeIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CalendarIcon,
  BanknotesIcon,
  ChartBarIcon,
  ArrowPathIcon,
  ArrowsPointingOutIcon
} from '@heroicons/react/24/outline';

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        const response = await loanApplicationsAPI.getById(id);
        setApplication(response.data.loanApplication);
        setNewStatus(response.data.loanApplication.applicationStatus);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching application:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const handleBack = () => {
    navigate('/loan-applications');
  };

  const openStatusModal = () => {
    setShowStatusModal(true);
  };

  const closeStatusModal = () => {
    setShowStatusModal(false);
  };

  const updateApplicationStatus = async () => {
    if (!application || !newStatus) return;

    setUpdatingStatus(true);
    try {
      // Update the application status via API
      await loanApplicationsAPI.updateStatus(application._id, { 
        status: newStatus,
        remarks: `Status updated to ${newStatus} by admin`
      });
      
      // Update local state
      setApplication(prev => ({
        ...prev,
        applicationStatus: newStatus
      }));
      
      closeStatusModal();
    } catch (error) {
      console.error('Error updating application status:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

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
        return <ClockIcon className="h-5 w-5" />;
      case 'approved':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'rejected':
        return <XCircleIcon className="h-5 w-5" />;
      case 'disbursed':
        return <CurrencyRupeeIcon className="h-5 w-5" />;
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

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
        <p className="mt-4 text-sm text-gray-500">Loading application details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-red-800">Error Loading Application</h2>
          <p className="text-red-600 mt-2">{error}</p>
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-yellow-800">Application Not Found</h2>
          <p className="text-yellow-600 mt-2">The requested application could not be found.</p>
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                <DocumentTextIcon className="h-8 w-8 text-white" />
              </div>
              Application #{application._id?.substring(0, 8)}
            </h1>
            <p className="text-sm text-gray-600 mt-1">Detailed view of loan application</p>
          </div>
        </div>
        
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <ArrowPathIcon className="h-5 w-5" />
          Refresh
        </button>
      </div>

      {/* Status Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Application Status</h2>
            <p className="text-sm text-gray-600 mt-1">
              Current status of the loan application
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(application.applicationStatus)}`}>
              {getStatusIcon(application.applicationStatus)}
              {application.applicationStatus?.charAt(0).toUpperCase() + application.applicationStatus?.slice(1)}
            </span>
            
            <button
              onClick={openStatusModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              <ArrowsPointingOutIcon className="h-4 w-4" />
              Update Status
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Customer & Personal Info */}
        <div className="space-y-8">
          {/* Customer Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UserCircleIcon className="h-5 w-5 text-indigo-600" />
              Customer Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Full Name</p>
                <p className="text-sm text-gray-900 mt-1">{application.authId?.fullName || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <p className="text-sm text-gray-900 mt-1">{application.authId?.email || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700">Phone Number</p>
                <p className="text-sm text-gray-900 mt-1">{application.authId?.phoneNo || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700">Date of Birth</p>
                <p className="text-sm text-gray-900 mt-1">
                  {application.authId?.dob ? new Date(application.authId.dob).toLocaleDateString('en-IN') : 'N/A'}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700">Address</p>
                <p className="text-sm text-gray-900 mt-1">
                  {application.authId?.address?.street || 'N/A'}, {application.authId?.address?.city || 'N/A'}, 
                  {application.authId?.address?.state || 'N/A'} - {application.authId?.address?.pincode || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BanknotesIcon className="h-5 w-5 text-indigo-600" />
              Employment Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Employment Type</p>
                <p className="text-sm text-gray-900 mt-1">{application.employmentType || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700">Company Name</p>
                <p className="text-sm text-gray-900 mt-1">{application.companyName || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700">Monthly Income</p>
                <p className="text-sm text-gray-900 mt-1 font-semibold">
                  {formatCurrency(application.monthlyIncome || 0)}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700">Years of Experience</p>
                <p className="text-sm text-gray-900 mt-1">{application.yearsOfExperience || 'N/A'} years</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Loan & Financial Info */}
        <div className="space-y-8">
          {/* Loan Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CurrencyRupeeIcon className="h-5 w-5 text-indigo-600" />
              Loan Details
            </h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Loan Type</p>
                <p className="text-sm text-gray-900 mt-1">{application.loanTypeId?.loanName || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700">Loan Amount</p>
                <p className="text-sm text-gray-900 mt-1 font-semibold">
                  {formatCurrency(application.loanAmount || 0)}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700">Tenure</p>
                <p className="text-sm text-gray-900 mt-1">{application.tenure || 0} months</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700">Interest Rate</p>
                <p className="text-sm text-gray-900 mt-1">{application.interestRate || 'N/A'}%</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700">Purpose</p>
                <p className="text-sm text-gray-900 mt-1">{application.purpose || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ChartBarIcon className="h-5 w-5 text-indigo-600" />
              Financial Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Credit Score</p>
                <p className="text-sm text-gray-900 mt-1">{application.creditScore || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700">Existing Loans</p>
                <p className="text-sm text-gray-900 mt-1">
                  {application.existingLoans ? 'Yes' : 'No'}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700">EMI to Income Ratio</p>
                <p className="text-sm text-gray-900 mt-1">{application.emiToIncomeRatio || 'N/A'}%</p>
              </div>
            </div>
          </div>

          {/* Application Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-indigo-600" />
              Application Timeline
            </h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Applied Date</p>
                <p className="text-sm text-gray-900 mt-1">{formatDate(application.appliedAt)}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700">Updated Date</p>
                <p className="text-sm text-gray-900 mt-1">
                  {application.updatedAt ? formatDate(application.updatedAt) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Update Application Status</h3>
              <button 
                onClick={closeStatusModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Application ID: <span className="font-mono">{application._id}</span>
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Customer: <span className="font-semibold">{application.authId?.fullName}</span>
              </p>
              
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select New Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="disbursed">Disbursed</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={closeStatusModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                disabled={updatingStatus}
              >
                Cancel
              </button>
              <button
                onClick={updateApplicationStatus}
                disabled={updatingStatus}
                className="px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updatingStatus ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationDetail;