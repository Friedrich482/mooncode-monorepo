import { TRPCError } from "@trpc/server";
import { TriangleAlert } from "lucide-react";
import { isAfter } from "date-fns";
import { useEffect } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { usePeriodStore } from "@/hooks/store/periodStore";

type BaseErrorProps = {
  error: TRPCError;
};

type WithChildrenProps = BaseErrorProps & {
  children: React.ReactNode;
  className?: never;
};

type WithoutChildrenProps = BaseErrorProps & {
  children?: never;
  className?: string;
};

type ErrorComponentProps = WithChildrenProps | WithoutChildrenProps;

const ErrorFallBack = ({ error, className, children }: ErrorComponentProps) => {
  const customRange = usePeriodStore((state) => state.customRange);
  const { resetBoundary } = useErrorBoundary();

  // reset the error boundary only if the range is reset properly (start date before end date)
  useEffect(() => {
    if (!isAfter(customRange.start, customRange.end)) resetBoundary();
  }, [customRange.start, customRange.end]);

  const parsedErrors = JSON.parse(error.message);
  if (Array.isArray(parsedErrors)) {
    const errorMessages = parsedErrors.map((err) => err.message);
    return children !== undefined ? (
      children
    ) : (
      <div
        className={
          className ||
          "relative z-0 flex min-h-96 w-[45%] items-center justify-center rounded-md border border-neutral-600/50 px-1.5 text-2xl text-red-600 max-xl:text-xl max-chart:w-full max-[30rem]:text-lg"
        }
      >
        <p className="flex gap-2">
          <TriangleAlert className="size-8 shrink-0 self-start max-xl:size-6" />
          <span>{errorMessages[0]}</span>
        </p>
      </div>
    );
  }
  return children !== undefined ? (
    children
  ) : (
    <div
      className={
        className ||
        "relative z-0 flex min-h-96 w-[45%] items-center justify-center rounded-md border border-neutral-600/50 px-1.5 text-2xl text-red-600 max-xl:text-xl max-chart:w-full max-[30rem]:text-lg"
      }
    >
      <p className="flex gap-2">
        <TriangleAlert className="size-8 shrink-0 self-start max-xl:size-6" />
        <span>{error.message}</span>
      </p>
    </div>
  );
};

export default ErrorFallBack;
