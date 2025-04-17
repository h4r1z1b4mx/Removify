"use client"
import { DirectionAwareHoverDemo } from "@/components/DirectionAwareHoverDemo";
import { MovingBorderDemo } from "@/components/MovingButton";
import { NavbarDemo } from "@/components/Navbar";
import DownloadButton from "@/components/DownloadButton";
import { useSearchParams } from 'next/navigation';

export default function Home() {
  const searchParams = useSearchParams();
  const imageId = searchParams.get('imageId'); // Get imageId from URL query

  return (
    <>
        <NavbarDemo />
        <div className="flex flex-col justify-center items-center">
          <DirectionAwareHoverDemo />
          <div className="mt-8">
            <MovingBorderDemo />
          </div>
          <div className="mt-12">
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
