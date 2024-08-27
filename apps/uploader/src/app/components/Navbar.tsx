import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">
              SyllabusPlanner
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#how-it-works"
              className="text-gray-600 hover:text-blue-500 font-medium"
            >
              How It Works
            </a>
            <a
              href="#upload"
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            >
              Upload
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-blue-500 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={
                    isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'
                  }
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <a
            href="#how-it-works"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-blue-500"
          >
            How It Works
          </a>
          <a
            href="#upload"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-blue-500"
          >
            Upload
          </a>
        </div>
      )}
    </nav>
  );
}
