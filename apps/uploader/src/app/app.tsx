import Footer from './components/Footer';
import HowItWorks from './components/HowItWorks';
import Navbar from './components/Navbar';
import UploadScheduleSection from './components/UploadScheduleSection';

export function App() {
  return (
    <>
      <Navbar />
      <HowItWorks />

      {/* Ad Section Between HowItWorks and UploadSchedule */}
      <section className="py-8 bg-gray-100 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Placeholder for Ad */}
          <div className="bg-gray-300 h-32 rounded-lg flex items-center justify-center">
            <p className="text-gray-600">Ad Space</p>
          </div>
        </div>
      </section>

      <UploadScheduleSection />

      {/* Ad Section Above Footer */}
      <section className="py-8 bg-gray-100 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Placeholder for Ad */}
          <div className="bg-gray-300 h-32 rounded-lg flex items-center justify-center">
            <p className="text-gray-600">Ad Space</p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default App;
