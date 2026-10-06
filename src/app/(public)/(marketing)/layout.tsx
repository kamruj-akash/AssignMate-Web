import { Footer } from "@/components/home/footer";
import { Navbar } from "@/components/home/navbar";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
