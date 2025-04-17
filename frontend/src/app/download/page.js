"use client"
import { NavbarDemo } from "@/components/Navbar";
import DownloadButton from "@/components/DownloadButton";
import { useSearchParams } from 'next/navigation';

export default function Home() {
  const searchParams = useSearchParams();
  const imageId = searchParams.get('imageId'); // Get imageId from URL query

  return (
    <>
        <NavbarDemo />
        <div className="w-full h-full flex flex-col justify-center items-center">
          <div className="w-full h-full flex justify-center items-center mt-12">
            {/* Ensure imageId is available before rendering DownloadButton */}
            {imageId ? (
              <DownloadButton imageId={imageId} />
            ) : (
              <p>Loading...</p> // Display loading text if imageId is not yet available
            )}
          </div>
        </div>
    </>
  );
}
