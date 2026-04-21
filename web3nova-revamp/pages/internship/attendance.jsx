import Attendance from "@/components/Internship/attendance";
import Navbar from "@/components/Hero/navbar";
import Footer from "@/components/Footer";

export default function AttendancePage() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <Navbar />
      <div className="relative z-10">
        <Attendance />
      </div>
      <Footer />
    </div>
  );
}
