import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const UserLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex w-full">
        {/* Sidebar - Fixed width, no margin */}
        <div className="hidden md:flex md:w-64 md:flex-shrink-0">
          <Sidebar role="driver" />
        </div>

        {/* Main Content - Takes remaining space, full width */}
        <div className="flex-1 w-full min-w-0">
          {/* Mobile Menu Button - Only visible on mobile */}
          <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3">
            <button className="text-gray-500 hover:text-gray-700">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Page Content - Outlet for nested routes */}
          <div className="w-full p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
