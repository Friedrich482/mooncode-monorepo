import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { Suspense } from "react";

const SuspenseBoundary = ({
  children,
  fallBackClassName,
}: {
  children: React.ReactNode;
  fallBackClassName?: string;
}) => {
  return (
    <Suspense
      fallback={
        <Skeleton
          className={fallBackClassName || "h-[24rem] w-[45%] max-chart:w-full"}
        />
      }
    >
      {children}
    </Suspense>
  );
};

export default SuspenseBoundary;
