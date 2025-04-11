"use client";
import React from "react";
import { Button } from "./ui/moving-border";


export function MovingBorderDemo() {
  return (
    
    <div className="w-full flex justify-center item-center">
     
            <Button
            borderRadius="1.75rem"
            className="cursor-pointer bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800">
            Submit
        </Button>

    </div>
  
  );
}
