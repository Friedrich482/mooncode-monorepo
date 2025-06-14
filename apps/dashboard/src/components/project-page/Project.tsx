import CustomRangeDatesSelector from "../CustomRangeDatesSelector";
import { ErrorBoundary } from "react-error-boundary";
import { Navigate } from "react-router";
import PeriodDropDown from "../dashboard-page/PeriodDropDown";
import ProjectTitle from "./ProjectTitle";
import SuspenseBoundary from "../suspense/SuspenseBoundary";
import { TRPCClientError } from "@trpc/client";
import TimeSpentOnProject from "./TimeSpentOnProject";

const LocalErrorBoundary = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary
    FallbackComponent={({ error }) => {
      if (
        error instanceof TRPCClientError &&
        error.data?.code === "NOT_FOUND"
      ) {
        return <Navigate to="/not-found" />;
      }

      return <div className="h-9 text-red-600">{error.message}</div>;
    }}
    children={children}
  />
);

const Project = () => {
  return (
    <main className="flex flex-col gap-x-10 px-14 pb-4 text-black dark:text-white">
      <LocalErrorBoundary>
        <SuspenseBoundary fallBackClassName="h-9 w-52">
          <ProjectTitle />
        </SuspenseBoundary>
      </LocalErrorBoundary>

      <div className="flex flex-wrap items-center gap-2 pt-4 text-center text-2xl max-[25.625rem]:text-base">
        <PeriodDropDown />
        <LocalErrorBoundary>
          <SuspenseBoundary fallBackClassName="h-9 w-44">
            <TimeSpentOnProject />
          </SuspenseBoundary>
        </LocalErrorBoundary>
        <CustomRangeDatesSelector />
      </div>
    </main>
  );
};

export default Project;
