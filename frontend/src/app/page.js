import { GridBackgroundDemo } from "@/components/Backgound";
import { LampDemo } from "@/components/Lamp";
import { NavbarDemo } from "@/components/Navbar";
import { TypewriterEffectSmoothDemo } from "@/components/Type";

export default function Home() {
  return (
    <>
      <div className="fixed top-0 w-full z-50">
        <NavbarDemo />
      </div>
      <div className="pt-20">
        <GridBackgroundDemo />
        <LampDemo />
        <TypewriterEffectSmoothDemo />
      </div>
    </>
  );
}
