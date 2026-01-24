import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  CreditCardIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  CogIcon,
  XMarkIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Loan Applications', href: '/loan-applications', icon: DocumentTextIcon },
    { name: 'Loan Types', href: '/loan-types', icon: CreditCardIcon },
    { name: 'Customers', href: '/customers', icon: UserGroupIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
    { name: 'Settings', href: '/settings', icon: CogIcon },
  ];

  // Get admin user info from localStorage or fallback to default
  const token = localStorage.getItem('adminToken');
  let adminName = 'Admin User';
  let adminEmail = 'admin@elitepaisa.com';
  
  if (token) {
    try {
      // Decode JWT payload (second part)
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        adminName = payload.user?.fullName || payload.fullName || 'Admin User';
        adminEmail = payload.user?.email || payload.email || 'admin@elitepaisa.com';
      }
    } catch (error) {
      console.warn('Failed to decode token:', error);
    }
  }
  
  const initials = adminName
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
  
  return (
    <div className="flex h-full w-full flex-col bg-indigo-700 text-white">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-indigo-600 px-4">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-white text-indigo-700 flex items-center justify-center font-bold">EP</div>
          <span className="text-xl font-semibold">ElitePaisa</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-800 text-white'
                  : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User profile section */}
      <div className="border-t border-indigo-600 p-4">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center font-semibold">
            {initials}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{adminName}</p>
            <p className="text-xs text-indigo-200">{adminEmail}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;