import { Button } from "./button";
import { LucideProps } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

const Icon = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    Icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
  }
>(({ className, Icon, ...props }, ref) => (
  <Button
    className={cn(
      "flex size-10 flex-shrink-0 items-center justify-center border-none border-transparent bg-transparent p-0 text-white shadow-none hover:bg-accent hover:text-white [&_svg]:size-auto",
      className,
    )}
    ref={ref}
    {...props}
  >
    <Icon className="text-black dark:text-white" />
  </Button>
));

export default Icon;
