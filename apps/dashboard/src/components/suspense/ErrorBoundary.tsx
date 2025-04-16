import { DefaultErrorShape } from "@trpc/server/unstable-core-do-not-import";
import { TRPCClientErrorLike } from "@trpc/client";

const ErrorBoundary = ({
  error,
  className,
}: {
  error: TRPCClientErrorLike<{
    transformer: true;
    errorShape: DefaultErrorShape;
  }>;
  className?: string;
}) => {
  return (
    <div
      className={className || "h-[24rem] w-[45%] text-red-500 max-chart:w-full"}
    >
      An error occurred : ${error.message}
    </div>
  );
};

export default ErrorBoundary;
