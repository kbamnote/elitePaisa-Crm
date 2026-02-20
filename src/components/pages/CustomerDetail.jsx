import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customersAPI } from '../../services/api';
import DeleteModal from '../common/modals/DeleteModal';
import SuccessModal from '../common/modals/SuccessModal';
import { 
  ArrowLeftIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  IdentificationIcon,
  BuildingOfficeIcon,
  CurrencyRupeeIcon,
  CalendarIcon,
  UserGroupIcon,
  PencilIcon,
  TrashIcon,
  CheckBadgeIcon,
  BanknotesIcon,
  ClockIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const response = await customersAPI.getById(id);
        setCustomer(response.data.profile);
      } catch (err) {
        console.error('Error fetching customer:', err);
        setError('Failed to load customer details');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  const handleDeleteCustomer = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteCustomer = async () => {
    try {
      setDeleting(true);
      console.log('Attempting to delete customer with ID:', id);
      
      const response = await customersAPI.delete(id);
      console.log('Delete response:', response.data);
      
      setDeleting(false);
      setShowDeleteModal(false);
      
      setSuccessMessage('Customer deleted successfully!');
      setShowSuccessModal(true);
      
      setTimeout(() => {
        navigate('/customers');
      }, 1500);
      
    } catch (error) {
      console.error('Error deleting customer:', error);
      setDeleting(false);
      
      let errorMessage = 'Unknown error';
      if (error.response) {
        errorMessage = error.response.data?.message || `HTTP ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        errorMessage = 'Network error: Unable to reach server';
      } else {
        errorMessage = error.message;
      }
      
      alert(`Failed to delete customer. Error: ${errorMessage}`);
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
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
        <p className="mt-4 text-sm text-gray-500">Loading customer details...</p>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{error || 'Customer not found'}</h3>
          <p className="text-sm text-gray-500 mb-6">The customer you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/customers')}
            className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg font-medium"
          >
            Back to Customers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with Back Button */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/customers')}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Customers
        </button>
        
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              {/* Profile Picture */}
              <div className="relative">
                {customer.profilePic ? (
                  <img
                    src={customer.profilePic}
                    alt="Profile"
                    className="h-24 w-24 rounded-2xl object-cover border-4 border-white/30 shadow-lg"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-2xl bg-white/20 flex items-center justify-center border-4 border-white/30 shadow-lg">
                    <UserGroupIcon className="h-12 w-12 text-white" />
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 border-4 border-white shadow-lg">
                  <CheckBadgeIcon className="h-4 w-4 text-white" />
                </div>
              </div>
              
              {/* Name and Basic Info */}
              <div>
                <h1 className="text-3xl font-bold mb-2">{customer.fullName || 'N/A'}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-indigo-100">
                  <div className="flex items-center gap-1.5">
                    <EnvelopeIcon className="h-4 w-4" />
                    {customer.email || 'N/A'}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <PhoneIcon className="h-4 w-4" />
                    {customer.phoneNo || 'N/A'}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon className="h-4 w-4" />
                    Joined {new Date(customer.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-colors flex items-center gap-2 text-sm font-medium">
                <PencilIcon className="h-4 w-4" />
                Edit
              </button>
              <button 
                onClick={handleDeleteCustomer}
                className="px-4 py-2 bg-red-500/90 hover:bg-red-600 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <TrashIcon className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <UserIcon className="h-5 w-5 text-indigo-600" />
                </div>
                Personal Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField label="Full Name" value={customer.fullName} />
                <InfoField label="Email Address" value={customer.email} icon={EnvelopeIcon} />
                <InfoField label="Primary Phone" value={customer.phoneNo} icon={PhoneIcon} />
                <InfoField label="Secondary Phone" value={customer.phoneNo2} icon={PhoneIcon} />
                <InfoField label="Age" value={customer.age} />
                <InfoField 
                  label="Registration Date" 
                  value={formatDate(customer.createdAt)} 
                  icon={CalendarIcon} 
                />
              </div>
            </div>
          </div>

          {/* Identity Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ShieldCheckIcon className="h-5 w-5 text-purple-600" />
                </div>
                Identity Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField 
                  label="PAN Number" 
                  value={customer.panNo} 
                  className="font-mono text-base"
                />
                <InfoField 
                  label="Aadhaar Number" 
                  value={customer.adharNo ? customer.adharNo.replace(/(\d{4})/g, '$1 ') : 'N/A'} 
                  className="font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MapPinIcon className="h-5 w-5 text-green-600" />
                </div>
                Address Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <InfoField label="Address Line" value={customer.address?.addressLine} />
                </div>
                <InfoField label="City" value={customer.address?.city} />
                <InfoField label="State" value={customer.address?.state} />
                <InfoField label="Pincode" value={customer.address?.pincode} />
              </div>
            </div>
          </div>

          {/* Employment Information */}
          {customer.employmentDetails && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <BuildingOfficeIcon className="h-5 w-5 text-orange-600" />
                  </div>
                  Employment Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoField 
                    label="Employment Type" 
                    value={customer.employmentDetails.employmentType} 
                    className="capitalize"
                  />
                  <InfoField label="Company Name" value={customer.employmentDetails.companyName} />
                  <InfoField 
                    label="Monthly Income" 
                    value={formatCurrency(customer.employmentDetails.monthlyIncome || 0)} 
                    icon={CurrencyRupeeIcon}
                  />
                  <InfoField label="Experience (Years)" value={customer.employmentDetails.experience} />
                </div>
              </div>
            </div>
          )}

          {/* Bank Details */}
          {customer.bankDetails && customer.bankDetails.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <div className="p-2 bg-cyan-100 rounded-lg">
                    <BanknotesIcon className="h-5 w-5 text-cyan-600" />
                  </div>
                  Bank Details
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {customer.bankDetails.map((bank, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-6 hover:border-indigo-200 transition-colors bg-gradient-to-br from-gray-50 to-white">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoField label="Bank Name" value={bank.bankName} />
                        <InfoField label="Account Number" value={bank.accountNo} className="font-mono" />
                        <InfoField label="Account Holder" value={bank.accountHolderName} />
                        <InfoField label="Branch" value={bank.bankBranch} />
                        <div className="md:col-span-2">
                          <InfoField label="IFSC Code" value={bank.ifscCode} className="font-mono" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-white/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <ClockIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-indigo-100">Member Since</p>
                    <p className="text-sm font-semibold">
                      {new Date(customer.createdAt).toLocaleDateString('en-IN', { 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pb-4 border-b border-white/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <IdentificationIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-indigo-100">KYC Status</p>
                    <p className="text-sm font-semibold">
                      {customer.panNo && customer.adharNo ? 'Verified' : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <CheckBadgeIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-indigo-100">Account Status</p>
                    <p className="text-sm font-semibold">Active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">System Information</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Customer ID</label>
                <p className="text-sm text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                  {customer._id}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Created At</label>
                <p className="text-sm text-gray-900">{formatDate(customer.createdAt)}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Last Updated</label>
                <p className="text-sm text-gray-900">{formatDate(customer.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
            </div>
            <div className="p-6 space-y-3">
              <button className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md font-medium flex items-center justify-center gap-2">
                <PencilIcon className="h-4 w-4" />
                Edit Customer
              </button>
              <button 
                onClick={handleDeleteCustomer}
                className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <TrashIcon className="h-4 w-4" />
                Delete Customer
              </button>
              <button 
                onClick={() => navigate('/customers')}
                className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to List
              </button>
            </div>
          </div>
        </div>
      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteCustomer}
        title="Delete Customer"
        message={`Are you sure you want to delete ${customer.fullName || 'this customer'}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleting}
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

// Helper component for info fields
const InfoField = ({ label, value, icon: Icon, className = '' }) => (
  <div>
    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
      {label}
    </label>
    <p className={`text-sm text-gray-900 flex items-center gap-2 ${className}`}>
      {Icon && <Icon className="h-4 w-4 text-gray-400 flex-shrink-0" />}
      {value || 'N/A'}
    </p>
  </div>
);

export default CustomerDetail;