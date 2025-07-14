import Navbar from "@/components/Navbar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import LandingPage from "./(nondashboard)/landing/page";

export default function Home() {
  return (
    <div className="h-full w-full">
      <Navbar />
      <main
        className="h-full w-full flex flex-col"
        style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}
      >
        <LandingPage />
      </main>
    </div>
  );
}
