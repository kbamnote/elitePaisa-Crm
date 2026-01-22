import { useState } from 'react';
import { 
  CogIcon, 
  UserCircleIcon, 
  ShieldCheckIcon, 
  KeyIcon, 
  BellIcon,
  DocumentTextIcon,
  CreditCardIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', name: 'General', icon: CogIcon },
    { id: 'profile', name: 'Profile', icon: UserCircleIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'api', name: 'API Keys', icon: KeyIcon },
  ];

  const generalSettings = [
    { id: 'companyName', label: 'Company Name', type: 'text', value: 'ElitePaisa Financial Services' },
    { id: 'companyEmail', label: 'Company Email', type: 'email', value: 'info@elitepaisa.com' },
    { id: 'companyPhone', label: 'Company Phone', type: 'tel', value: '+91 9876543210' },
    { id: 'address', label: 'Address', type: 'textarea', value: '123 Business Park, Mumbai, Maharashtra 400001' },
    { id: 'timezone', label: 'Timezone', type: 'select', value: 'Asia/Kolkata', options: ['Asia/Kolkata', 'UTC', 'America/New_York'] },
  ];

  const notificationSettings = [
    { id: 'emailNotifications', label: 'Email Notifications', checked: true },
    { id: 'smsNotifications', label: 'SMS Notifications', checked: true },
    { id: 'pushNotifications', label: 'Push Notifications', checked: false },
    { id: 'loanApplicationUpdates', label: 'Loan Application Updates', checked: true },
    { id: 'paymentReminders', label: 'Payment Reminders', checked: true },
  ];

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your ElitePaisa admin panel settings</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-1/4">
          <nav className="bg-white shadow rounded-lg p-2">
            <ul className="space-y-1">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === tab.id
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="mr-3 h-5 w-5" />
                    {tab.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          <div className="bg-white shadow rounded-lg p-6">
            {activeTab === 'general' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-6">General Settings</h2>
                <div className="space-y-6">
                  {generalSettings.map((setting) => (
                    <div key={setting.id} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                        {setting.label}
                      </label>
                      <div className="sm:col-span-2">
                        {setting.type === 'textarea' ? (
                          <textarea
                            rows={3}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            defaultValue={setting.value}
                          />
                        ) : setting.type === 'select' ? (
                          <select
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            defaultValue={setting.value}
                          >
                            {setting.options?.map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={setting.type}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            defaultValue={setting.value}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-6">Profile Information</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      Profile Picture
                    </label>
                    <div className="sm:col-span-2">
                      <div className="flex items-center">
                        <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                          <UserCircleIcon className="h-full w-full text-gray-300" />
                        </span>
                        <button
                          type="button"
                          className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      Full Name
                    </label>
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        defaultValue="Admin User"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      Email Address
                    </label>
                    <div className="sm:col-span-2">
                      <input
                        type="email"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        defaultValue="admin@elitepaisa.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      Phone Number
                    </label>
                    <div className="sm:col-span-2">
                      <input
                        type="tel"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        defaultValue="+91 9876543210"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-6">Security Settings</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      Current Password
                    </label>
                    <div className="sm:col-span-2">
                      <input
                        type="password"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      New Password
                    </label>
                    <div className="sm:col-span-2">
                      <input
                        type="password"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      Confirm New Password
                    </label>
                    <div className="sm:col-span-2">
                      <input
                        type="password"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-3">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="two-factor"
                            name="two-factor"
                            type="checkbox"
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="two-factor" className="font-medium text-gray-700">
                            Enable Two-Factor Authentication
                          </label>
                          <p className="text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-6">Notification Settings</h2>
                <div className="space-y-4">
                  {notificationSettings.map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id={setting.id}
                          name={setting.id}
                          type="checkbox"
                          defaultChecked={setting.checked}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor={setting.id} className="ml-3 block text-sm font-medium text-gray-700">
                          {setting.label}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-6">API Keys</h2>
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">Production API Key</h3>
                        <p className="text-sm text-gray-500">Used for live transactions</p>
                      </div>
                      <button className="text-sm text-indigo-600 hover:text-indigo-900">
                        Regenerate
                      </button>
                    </div>
                    <div className="mt-2">
                      <code className="text-xs bg-white p-2 rounded border block font-mono">
                        pk_prod_**************************************
                      </code>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">Test API Key</h3>
                        <p className="text-sm text-gray-500">Used for testing purposes</p>
                      </div>
                      <button className="text-sm text-indigo-600 hover:text-indigo-900">
                        Regenerate
                      </button>
                    </div>
                    <div className="mt-2">
                      <code className="text-xs bg-white p-2 rounded border block font-mono">
                        pk_test_**************************************
                      </code>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Generate New API Key
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSave}
                type="button"
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;