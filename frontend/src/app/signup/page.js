import { NavbarDemo } from "@/components/Navbar";
import { SignupFormDemo } from "@/components/SignUp";

export default function Home() {
  return (
    <>
      <NavbarDemo/>
      <div className="pt-20">
        <SignupFormDemo/>
      </div>
    </>
  );
}
