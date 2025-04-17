import { FileUploadDemo } from "@/components/FileUploadDemo";
import { NavbarDemo } from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <NavbarDemo/>
      <div className="h-full w-full flex flex-col justify-center item-center gap-10 pt-20">
        <div>
        <FileUploadDemo/>
        </div>
      </div>
    </>
  );
}
