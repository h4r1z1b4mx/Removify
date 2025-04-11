import { DirectionAwareHoverDemo } from "@/components/DirectionAwareHoverDemo";
import { MovingBorderDemo } from "@/components/MovingButton";
import { NavbarDemo } from "@/components/Navbar";

export default function Home() {
  return (
    <>
        <NavbarDemo/>
        <div className="flex flex-col justify-center ">
          <DirectionAwareHoverDemo/>
          <div className="">
            <MovingBorderDemo/>
          </div>
        </div>
    </>
  );
}
