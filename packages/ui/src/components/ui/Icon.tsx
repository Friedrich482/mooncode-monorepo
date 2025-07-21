import { Button } from "./button";
import { LucideProps } from "lucide-react";
import React, { ButtonHTMLAttributes } from "react";
import { cn } from "#lib/utils.ts";

const Icon = React.forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & {
    Icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
  } & { iconClassName?: string }
>(({ className, Icon, iconClassName, ...props }, ref) => (
  <Button
    className={cn(
      "flex size-10 flex-shrink-0 items-center justify-center border-none border-transparent bg-transparent p-0 text-white shadow-none hover:bg-accent hover:text-white [&_svg]:size-auto",
      className,
    )}
    ref={ref}
    {...props}
  >
    <Icon className={cn("text-black dark:text-white", iconClassName)} />
  </Button>
));
Icon.displayName = "Icon";

export default Icon;
