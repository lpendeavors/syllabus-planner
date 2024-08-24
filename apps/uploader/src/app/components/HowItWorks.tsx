import {
  ArrowUpOnSquareIcon,
  CalendarDaysIcon,
  DocumentArrowDownIcon,
} from '@heroicons/react/24/outline';

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center">
          How It Works
        </h2>
        <p className="mt-4 text-lg text-gray-600 text-center">
          Follow these three easy steps to get a consolidated schedule from your
          syllabi.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <ArrowUpOnSquareIcon className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Step 1: Upload
            </h3>
            <p className="mt-2 text-gray-600">
              Upload your syllabi by dragging and dropping the files or
              selecting them from your device.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <CalendarDaysIcon className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Step 2: Generate
            </h3>
            <p className="mt-2 text-gray-600">
              Our system processes your syllabi to create a consolidated
              schedule for all your assignments and deadlines.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <DocumentArrowDownIcon className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Step 3: Export
            </h3>
            <p className="mt-2 text-gray-600">
              Download your schedule in a format of your choice and stay on top
              of your studies!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
