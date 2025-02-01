import { Button } from "./ui/button";
import React from "react";
import { cn } from "@/lib/utils";

const Icon = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, className, ...props }, ref) => {
  return (
    <Button
      className={cn(
        "flex size-10 flex-shrink-0 items-center justify-center border-none border-transparent bg-transparent p-0 text-white shadow-none hover:bg-accent hover:text-white [&_svg]:size-auto",
        className,
      )}
      ref={ref} 
      {...props}
    >
      {children}
    </Button>
  );
});

export default Icon;
