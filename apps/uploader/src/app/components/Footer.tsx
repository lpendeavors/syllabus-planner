import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Branding / Copyright */}
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold text-blue-500">
              SyllabusPlanner
            </h1>
            <p className="mt-2 text-gray-400">
              &copy; {new Date().getFullYear()} SyllabusPlanner. All rights
              reserved.
            </p>
          </div>

          {/* Footer Links */}
          {/* <div className="space-x-8">
            <a href="#" className="text-gray-400 hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              Contact
            </a>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
