import { BellIcon, MagnifyingGlassIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { authAPI } from '../../services/api';

const Header = ({ toggleSidebar }) => {
  const handleLogout = async () => {
    try {
      // Call the logout API function
      await authAPI.logout();
      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, clear the token and redirect
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
  };
  
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
          onClick={toggleSidebar}
        >
          <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
        </button>

        <div className="flex items-center">
          <h1 className="text-2xl font-semibold text-gray-800 capitalize">
            {window.location.pathname.split('/')[1] || 'dashboard'}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search bar */}
          <div className="relative hidden sm:block">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Search..."
            />
          </div>

          {/* Notifications */}
          <button className="relative rounded-full p-1 text-gray-700 hover:bg-gray-100">
            <BellIcon className="h-6 w-6" aria-hidden="true" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">3</span>
          </button>

          {/* Logout button */}
          <button 
            onClick={handleLogout}
            className="rounded-full p-1 text-gray-700 hover:bg-gray-100"
          >
            <ArrowRightOnRectangleIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;