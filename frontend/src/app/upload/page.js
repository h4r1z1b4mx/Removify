import { FileUploadDemo } from "@/components/FileUploadDemo";
import { MovingBorderDemo } from "@/components/MovingButton";
import { NavbarDemo } from "@/components/Navbar";
import { Button } from "@/components/ui/moving-border";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <NavbarDemo/>
      <div className="h-full w-full flex flex-col justify-center item-center gap-10 pt-20">
        <div>
        <FileUploadDemo/>
        </div>
        <Link href={'/download'} className=" w-full flex item-center">
        
          <MovingBorderDemo/>
        </Link>
      </div>
    </>
  );
}
