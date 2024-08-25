import { AdSection } from './components/AdSection';
import Footer from './components/Footer';
import HowItWorks from './components/HowItWorks';
import Navbar from './components/Navbar';
import UploadScheduleSection from './components/UploadScheduleSection';

export function App() {
  return (
    <>
      <Navbar />
      <HowItWorks />
      <UploadScheduleSection />
      <Footer />
    </>
  );
}

export default App;
