import { useState, useEffect } from 'react';
import { 
  CreditCardIcon, 
  UserGroupIcon, 
  BanknotesIcon, 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { dashboardAPI, loanApplicationsAPI } from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState([
    {
      title: 'Total Applications',
      value: 'Loading...',
      change: '+0%',
      changeType: 'positive',
      icon: DocumentTextIcon,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Loans',
      value: 'Loading...',
      change: '+0%',
      changeType: 'positive',
      icon: CreditCardIcon,
      color: 'bg-green-500',
    },
    {
      title: 'Total Disbursed',
      value: 'Loading...',
      change: '+0%',
      changeType: 'positive',
      icon: BanknotesIcon,
      color: 'bg-purple-500',
    },
    {
      title: 'Pending Approvals',
      value: 'Loading...',
      change: '-0%',
      changeType: 'negative',
      icon: ChartBarIcon,
      color: 'bg-yellow-500',
    },
  ]);
  
  const [recentApplications, setRecentApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
            
        // Fetch dashboard stats
        const statsResponse = await dashboardAPI.getStats();
        const statsData = statsResponse.data.stats || {};
            
        const formattedStats = [
          {
            title: 'Total Applications',
            value: statsData.totalApplications?.toLocaleString() || '0',
            change: '+5%',
            changeType: 'positive',
            icon: DocumentTextIcon,
            color: 'bg-blue-500',
          },
          {
            title: 'Pending Applications',
            value: statsData.pendingApplications?.toLocaleString() || '0',
            change: '+2%',
            changeType: 'positive',
            icon: ChartBarIcon,
            color: 'bg-yellow-500',
          },
          {
            title: 'Approved Applications',
            value: statsData.approvedApplications?.toLocaleString() || '0',
            change: '+8%',
            changeType: 'positive',
            icon: CreditCardIcon,
            color: 'bg-green-500',
          },
          {
            title: 'Total Clients',
            value: statsData.totalClients?.toLocaleString() || '0',
            change: '+3%',
            changeType: 'positive',
            icon: UserGroupIcon,
            color: 'bg-purple-500',
          },
        ];
        setStats(formattedStats);
            
        // Fetch recent applications
        const recentAppsResponse = await dashboardAPI.getRecentApplications({ limit: 5 });
        const recentApps = recentAppsResponse.data.recentApplications || [];
            
        const formattedApplications = recentApps.map(app => ({
          id: app._id,
          customer: app.authId?.fullName || 'N/A',
          loanType: app.loanTypeId?.loanName || 'N/A',
          amount: `₹${app.loanAmount?.toLocaleString() || '0'}`,
          status: app.applicationStatus || 'Unknown',
          date: new Date(app.appliedAt).toISOString().split('T')[0],
        }));
            
        setRecentApplications(formattedApplications);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
            
        // Set empty arrays on error
        setStats([
          {
            title: 'Total Applications',
            value: '0',
            change: '+0%',
            changeType: 'positive',
            icon: DocumentTextIcon,
            color: 'bg-blue-500',
          },
          {
            title: 'Pending Applications',
            value: '0',
            change: '+0%',
            changeType: 'positive',
            icon: ChartBarIcon,
            color: 'bg-yellow-500',
          },
          {
            title: 'Approved Applications',
            value: '0',
            change: '+0%',
            changeType: 'positive',
            icon: CreditCardIcon,
            color: 'bg-green-500',
          },
          {
            title: 'Total Clients',
            value: '0',
            change: '+0%',
            changeType: 'positive',
            icon: UserGroupIcon,
            color: 'bg-purple-500',
          },
        ]);
        setRecentApplications([]);
      } finally {
        setIsLoading(false);
      }
    };
        
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`${stat.color} rounded-md p-3 text-white`}>
                  <stat.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="ml-4">
                  <dt className="truncate text-sm font-medium text-gray-500">{stat.title}</dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900">{stat.value}</dd>
                </div>
              </div>
            </div>
            <div className={`bg-gray-50 px-5 py-3 ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
              <div className="text-sm">
                {stat.changeType === 'positive' ? (
                  <span className="flex items-center">
                    <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                    {stat.change} from last month
                  </span>
                ) : (
                  <span className="flex items-center">
                    <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                    {stat.change} from last month
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Chart Placeholder */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900">Loan Applications Trend</h3>
          </div>
          <div className="p-6">
            <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Applications Chart</h3>
                <p className="mt-1 text-sm text-gray-500">Interactive chart showing loan applications over time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Applications</h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {recentApplications.map((application) => (
              <li key={application.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-indigo-600">{application.id}</p>
                      <p className="truncate text-sm text-gray-500">{application.customer}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{application.amount}</p>
                      <p className="text-sm text-gray-500">{application.loanType}</p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        application.status === 'Approved'
                          ? 'bg-green-100 text-green-800'
                          : application.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : application.status === 'Disbursed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {application.status}
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex items-center text-xs text-gray-500">
                  <span>{application.date}</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="bg-gray-50 px-6 py-4 text-center">
            <a href="/loan-applications" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View all applications
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;