import { LoginFormDemo } from "@/components/Login";
import { NavbarDemo } from "@/components/Navbar";

export default function Home() {
  return (
    <>
        <NavbarDemo/>
        <div className="p-20">
            <LoginFormDemo/>
        </div>
    </>
  );
}
