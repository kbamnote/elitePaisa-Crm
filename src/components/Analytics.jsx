import { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  CurrencyRupeeIcon, 
  DocumentTextIcon, 
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

const Analytics = () => {
  const [stats, setStats] = useState({
    totalApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    totalDisbursed: 0,
    activeLoans: 0,
    avgProcessingTime: 0
  });
  const [loading, setLoading] = useState(true);

  // Mock data for analytics
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockStats = {
        totalApplications: 1254,
        approvedApplications: 892,
        rejectedApplications: 156,
        totalDisbursed: 240000000, // 2.4 Cr
        activeLoans: 786,
        avgProcessingTime: 2.5 // days
      };
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
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
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">Comprehensive analytics and insights for your loan business</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="bg-blue-500 rounded-md p-3 text-white">
                <DocumentTextIcon className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="ml-4">
                <dt className="truncate text-sm font-medium text-gray-500">Total Applications</dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">{formatNumber(stats.totalApplications)}</dd>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3 text-green-600">
            <div className="text-sm">
              <span className="flex items-center">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                +12% from last month
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="bg-green-500 rounded-md p-3 text-white">
                <ArrowTrendingUpIcon className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="ml-4">
                <dt className="truncate text-sm font-medium text-gray-500">Approved Applications</dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">{formatNumber(stats.approvedApplications)}</dd>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3 text-green-600">
            <div className="text-sm">
              <span className="flex items-center">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                +8% from last month
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="bg-purple-500 rounded-md p-3 text-white">
                <CurrencyRupeeIcon className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="ml-4">
                <dt className="truncate text-sm font-medium text-gray-500">Total Disbursed</dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalDisbursed)}</dd>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3 text-green-600">
            <div className="text-sm">
              <span className="flex items-center">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                +15% from last month
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="bg-red-500 rounded-md p-3 text-white">
                <ArrowTrendingDownIcon className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="ml-4">
                <dt className="truncate text-sm font-medium text-gray-500">Rejected Applications</dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">{formatNumber(stats.rejectedApplications)}</dd>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3 text-red-600">
            <div className="text-sm">
              <span className="flex items-center">
                <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                -3% from last month
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="bg-yellow-500 rounded-md p-3 text-white">
                <UserGroupIcon className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="ml-4">
                <dt className="truncate text-sm font-medium text-gray-500">Active Loans</dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">{formatNumber(stats.activeLoans)}</dd>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3 text-green-600">
            <div className="text-sm">
              <span className="flex items-center">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                +5% from last month
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="bg-indigo-500 rounded-md p-3 text-white">
                <ChartBarIcon className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="ml-4">
                <dt className="truncate text-sm font-medium text-gray-500">Avg. Processing Time</dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">{stats.avgProcessingTime} days</dd>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3 text-red-600">
            <div className="text-sm">
              <span className="flex items-center">
                <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                -0.2 days from last month
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Applications by Status */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900">Applications by Status</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Approved (71%)</span>
                  <span className="text-sm font-medium text-gray-700">892</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '71%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Pending (10%)</span>
                  <span className="text-sm font-medium text-gray-700">126</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Rejected (12%)</span>
                  <span className="text-sm font-medium text-gray-700">156</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-red-600 h-2.5 rounded-full" style={{ width: '12%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Disbursed (7%)</span>
                  <span className="text-sm font-medium text-gray-700">80</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '7%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Applications by Loan Type */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900">Applications by Loan Type</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Personal (35%)</span>
                  <span className="text-sm font-medium text-gray-700">439</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Home (25%)</span>
                  <span className="text-sm font-medium text-gray-700">314</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Vehicle (20%)</span>
                  <span className="text-sm font-medium text-gray-700">251</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-pink-600 h-2.5 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Business (15%)</span>
                  <span className="text-sm font-medium text-gray-700">188</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Education (5%)</span>
                  <span className="text-sm font-medium text-gray-700">63</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-orange-600 h-2.5 rounded-full" style={{ width: '5%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900">Monthly Application Trends</h3>
        </div>
        <div className="p-6">
          <div className="flex items-end justify-between h-64">
            {[65, 45, 78, 52, 68, 38, 72, 55, 80, 60, 75, 85].map((height, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="w-8 bg-indigo-500 rounded-t hover:bg-indigo-600 transition-colors"
                  style={{ height: `${height}px` }}
                ></div>
                <span className="mt-2 text-xs text-gray-500">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;