import { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  CurrencyRupeeIcon, 
  DocumentTextIcon, 
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { analyticsAPI } from '../services/api';

const Analytics = () => {
  const [stats, setStats] = useState({
    totalApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    pendingApplications: 0,
    disbursedApplications: 0,
    totalDisbursed: 0,
    activeLoans: 0,
    avgProcessingTime: 0,
    personalLoans: 0,
    homeLoans: 0,
    vehicleLoans: 0,
    businessLoans: 0,
    educationLoans: 0,
    monthlyTrends: []
  });
  const [loading, setLoading] = useState(true);

  // Load analytics data from API
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await analyticsAPI.getStats();
        const apiStats = response.data.stats || {};
        setStats({
          totalApplications: apiStats.totalApplications || 0,
          approvedApplications: apiStats.approvedApplications || 0,
          rejectedApplications: apiStats.rejectedApplications || 0,
          pendingApplications: apiStats.pendingApplications || 0,
          disbursedApplications: apiStats.disbursedApplications || 0,
          totalDisbursed: apiStats.totalDisbursed || 0,
          activeLoans: apiStats.activeLoans || 0,
          avgProcessingTime: apiStats.avgProcessingTime || 0,
          personalLoans: apiStats.personalLoans || 0,
          homeLoans: apiStats.homeLoans || 0,
          vehicleLoans: apiStats.vehicleLoans || 0,
          businessLoans: apiStats.businessLoans || 0,
          educationLoans: apiStats.educationLoans || 0,
          monthlyTrends: apiStats.monthlyTrends || []
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
        // Set empty/default values on error
        setStats({
          totalApplications: 0,
          approvedApplications: 0,
          rejectedApplications: 0,
          pendingApplications: 0,
          disbursedApplications: 0,
          totalDisbursed: 0,
          activeLoans: 0,
          avgProcessingTime: 0,
          personalLoans: 0,
          homeLoans: 0,
          vehicleLoans: 0,
          businessLoans: 0,
          educationLoans: 0,
          monthlyTrends: []
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
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
                  <span className="text-sm font-medium text-gray-700">Approved ({stats.approvedApplications > 0 ? Math.round((stats.approvedApplications / (stats.totalApplications || 1)) * 100) : 0}%)</span>
                  <span className="text-sm font-medium text-gray-700">{stats.approvedApplications}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${stats.approvedApplications > 0 ? Math.round((stats.approvedApplications / (stats.totalApplications || 1)) * 100) : 0}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Pending ({stats.pendingApplications > 0 ? Math.round((stats.pendingApplications / (stats.totalApplications || 1)) * 100) : 0}%)</span>
                  <span className="text-sm font-medium text-gray-700">{stats.pendingApplications}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${stats.pendingApplications > 0 ? Math.round((stats.pendingApplications / (stats.totalApplications || 1)) * 100) : 0}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Rejected ({stats.rejectedApplications > 0 ? Math.round((stats.rejectedApplications / (stats.totalApplications || 1)) * 100) : 0}%)</span>
                  <span className="text-sm font-medium text-gray-700">{stats.rejectedApplications}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-red-600 h-2.5 rounded-full" style={{ width: `${stats.rejectedApplications > 0 ? Math.round((stats.rejectedApplications / (stats.totalApplications || 1)) * 100) : 0}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Disbursed ({stats.disbursedApplications > 0 ? Math.round((stats.disbursedApplications / (stats.totalApplications || 1)) * 100) : 0}%)</span>
                  <span className="text-sm font-medium text-gray-700">{stats.disbursedApplications}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${stats.disbursedApplications > 0 ? Math.round((stats.disbursedApplications / (stats.totalApplications || 1)) * 100) : 0}%` }}></div>
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
                  <span className="text-sm font-medium text-gray-700">Personal ({stats.personalLoans > 0 ? Math.round((stats.personalLoans / (stats.totalApplications || 1)) * 100) : 0}%)</span>
                  <span className="text-sm font-medium text-gray-700">{stats.personalLoans}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${stats.personalLoans > 0 ? Math.round((stats.personalLoans / (stats.totalApplications || 1)) * 100) : 0}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Home ({stats.homeLoans > 0 ? Math.round((stats.homeLoans / (stats.totalApplications || 1)) * 100) : 0}%)</span>
                  <span className="text-sm font-medium text-gray-700">{stats.homeLoans}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${stats.homeLoans > 0 ? Math.round((stats.homeLoans / (stats.totalApplications || 1)) * 100) : 0}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Vehicle ({stats.vehicleLoans > 0 ? Math.round((stats.vehicleLoans / (stats.totalApplications || 1)) * 100) : 0}%)</span>
                  <span className="text-sm font-medium text-gray-700">{stats.vehicleLoans}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-pink-600 h-2.5 rounded-full" style={{ width: `${stats.vehicleLoans > 0 ? Math.round((stats.vehicleLoans / (stats.totalApplications || 1)) * 100) : 0}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Business ({stats.businessLoans > 0 ? Math.round((stats.businessLoans / (stats.totalApplications || 1)) * 100) : 0}%)</span>
                  <span className="text-sm font-medium text-gray-700">{stats.businessLoans}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: `${stats.businessLoans > 0 ? Math.round((stats.businessLoans / (stats.totalApplications || 1)) * 100) : 0}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Education ({stats.educationLoans > 0 ? Math.round((stats.educationLoans / (stats.totalApplications || 1)) * 100) : 0}%)</span>
                  <span className="text-sm font-medium text-gray-700">{stats.educationLoans}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-orange-600 h-2.5 rounded-full" style={{ width: `${stats.educationLoans > 0 ? Math.round((stats.educationLoans / (stats.totalApplications || 1)) * 100) : 0}%` }}></div>
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
            {Array.from({ length: 12 }, (_, index) => {
              const monthData = stats.monthlyTrends?.[index] || 0;
              // Normalize the value to fit in the chart (max height 64px)
              const maxValue = Math.max(...(stats.monthlyTrends || [1]), 1);
              const height = Math.max(20, (monthData / maxValue) * 64); // Ensure minimum height of 20px
              
              return (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="w-8 bg-indigo-500 rounded-t hover:bg-indigo-600 transition-colors"
                    style={{ height: `${height}px` }}
                  ></div>
                  <span className="mt-2 text-xs text-gray-500">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                  </span>
                  <span className="mt-1 text-xs text-gray-700">{monthData}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;