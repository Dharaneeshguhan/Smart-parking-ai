import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  Search,
  Calendar,
  Users,
  Settings,
  DollarSign,
  TrendingUp,
  MapPin,
  Clock,
  Star,
  User,
  Heart,
  CreditCard
} from 'lucide-react';

const Sidebar = ({ role = 'driver' }) => {
  const driverMenuItems = [
    {
      name: 'Dashboard',
      href: '/user/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Find Parking',
      href: '/user/search',
      icon: Search,
    },
    {
      name: 'My Bookings',
      href: '/user/bookings',
      icon: Calendar,
    },
    {
      name: 'Payment History',
      href: '/user/payments',
      icon: CreditCard,
    },
    {
      name: 'Favorites',
      href: '/user/favorites',
      icon: Heart,
    },
    {
      name: 'Profile',
      href: '/user/profile',
      icon: User,
    },
    {
      name: 'Settings',
      href: '/user/settings',
      icon: Settings,
    },
  ];

  const ownerMenuItems = [
    {
      name: 'Dashboard',
      href: '/owner/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'My Parking Slots',
      href: '/owner/parking-slots',
      icon: MapPin,
    },
    {
      name: 'Add New Slot',
      href: '/owner/add-slot',
      icon: Car,
    },
    {
      name: 'Bookings',
      href: '/owner/bookings',
      icon: Calendar,
    },
    {
      name: 'Profile',
      href: '/owner/profile',
      icon: User,
    },
    {
      name: 'Settings',
      href: '/owner/settings',
      icon: Settings,
    },
  ];

  const menuItems = role === 'owner' ? ownerMenuItems : driverMenuItems;

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SP</span>
            </div>
            <span className="ml-2 text-lg font-semibold text-gray-900">SmartPark</span>
          </div>
        </div>
        <div className="mt-8 flex-grow flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ${isActive
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${item.name === 'Dashboard' ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                />
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-secondary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {role === 'owner' ? 'O' : 'D'}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 capitalize">{role} Account</p>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
