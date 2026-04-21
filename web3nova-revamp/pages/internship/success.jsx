import SuccessPage from "@/components/Internship/SuccessPage";
import Navbar from "@/components/Hero/navbar";
import Footer from "@/components/Footer";

export default function InternshipSuccessPage() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <Navbar />
      
      <div className="relative z-10">
        <SuccessPage />
      </div>

      <Footer />
    </div>
  );
}