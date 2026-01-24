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
  UserGroupIcon
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
        // Update the API call to use the new endpoint
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
      console.log('Full customer object:', customer);
      
      const response = await customersAPI.delete(id);
      console.log('Delete response status:', response.status);
      console.log('Delete response data:', response.data);
      
      setDeleting(false);
      setShowDeleteModal(false);
      
      // Show success modal
      setSuccessMessage('Customer deleted successfully!');
      setShowSuccessModal(true);
      
      // Navigate back to customers list after a short delay to show the success message
      setTimeout(() => {
        navigate('/customers');
      }, 1500);
      
    } catch (error) {
      console.error('Error deleting customer:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center">
          <div className="text-red-500 text-lg font-medium">{error || 'Customer not found'}</div>
          <button
            onClick={() => navigate('/customers')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Back to Customers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/customers')}
              className="mr-4 p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customer Details</h1>
              <p className="text-sm text-gray-500">View complete customer information</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Card */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2 text-indigo-600" />
                  Personal Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Full Name</label>
                    <p className="mt-1 text-sm text-gray-900">{customer.fullName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email</label>
                    <p className="mt-1 text-sm text-gray-900 flex items-center">
                      <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {customer.email || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Primary Phone</label>
                    <p className="mt-1 text-sm text-gray-900 flex items-center">
                      <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {customer.phoneNo || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Secondary Phone</label>
                    <p className="mt-1 text-sm text-gray-900 flex items-center">
                      <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {customer.phoneNo2 || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Age</label>
                    <p className="mt-1 text-sm text-gray-900">{customer.age || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Registration Date</label>
                    <p className="mt-1 text-sm text-gray-900 flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {formatDate(customer.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Identity Information */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <IdentificationIcon className="h-5 w-5 mr-2 text-indigo-600" />
                  Identity Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">PAN Number</label>
                    <p className="mt-1 text-sm text-gray-900">{customer.panNo || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Aadhaar Number</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {customer.adharNo ? customer.adharNo.replace(/(\d{4})/g, '$1 ') : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2 text-indigo-600" />
                  Address Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500">Address Line</label>
                    <p className="mt-1 text-sm text-gray-900">{customer.address?.addressLine || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">City</label>
                    <p className="mt-1 text-sm text-gray-900">{customer.address?.city || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">State</label>
                    <p className="mt-1 text-sm text-gray-900">{customer.address?.state || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Pincode</label>
                    <p className="mt-1 text-sm text-gray-900">{customer.address?.pincode || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Employment Information */}
            {customer.employmentDetails && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900 flex items-center">
                    <BuildingOfficeIcon className="h-5 w-5 mr-2 text-indigo-600" />
                    Employment Information
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Employment Type</label>
                      <p className="mt-1 text-sm text-gray-900 capitalize">
                        {customer.employmentDetails.employmentType || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Company Name</label>
                      <p className="mt-1 text-sm text-gray-900">{customer.employmentDetails.companyName || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Monthly Income</label>
                      <p className="mt-1 text-sm text-gray-900 flex items-center">
                        <CurrencyRupeeIcon className="h-4 w-4 mr-1 text-gray-400" />
                        {formatCurrency(customer.employmentDetails.monthlyIncome || 0)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Experience (Years)</label>
                      <p className="mt-1 text-sm text-gray-900">{customer.employmentDetails.experience || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bank Details */}
            {customer.bankDetails && customer.bankDetails.length > 0 && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Bank Details</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {customer.bankDetails.map((bank, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Bank Name</label>
                            <p className="mt-1 text-sm text-gray-900">{bank.bankName || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Account Number</label>
                            <p className="mt-1 text-sm text-gray-900">{bank.accountNo || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Account Holder Name</label>
                            <p className="mt-1 text-sm text-gray-900">{bank.accountHolderName || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Bank Branch</label>
                            <p className="mt-1 text-sm text-gray-900">{bank.bankBranch || 'N/A'}</p>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-500">IFSC Code</label>
                            <p className="mt-1 text-sm text-gray-900">{bank.ifscCode || 'N/A'}</p>
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
            {/* Profile Picture */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Profile Picture</h3>
              </div>
              <div className="p-6">
                <div className="flex justify-center">
                  {customer.profilePic ? (
                    <img
                      src={customer.profilePic}
                      alt="Profile"
                      className="h-32 w-32 rounded-full object-cover border-4 border-gray-200"
                    />
                  ) : (
                    <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-200">
                      <UserGroupIcon className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6 space-y-3">
                <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center justify-center">
                  Edit Customer
                </button>
                <button 
                  onClick={handleDeleteCustomer}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center justify-center"
                >
                  Delete Customer
                </button>
                <button 
                  onClick={() => navigate('/customers')}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 flex items-center justify-center"
                >
                  Back to List
                </button>
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Metadata</h3>
              </div>
              <div className="p-6 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Customer ID</label>
                  <p className="mt-1 text-sm text-gray-900 font-mono">{customer._id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(customer.updatedAt)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Status</label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
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

export default CustomerDetail;