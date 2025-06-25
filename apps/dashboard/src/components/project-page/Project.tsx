import CustomRangeDatesSelector from "../CustomRangeDatesSelector";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallBack from "../suspense/ErrorFallback";
import FilesCirclePackingChart from "./charts/FilesCirclePackingChart";
import FilesList from "./files-list/FilesList";
import { Navigate } from "react-router";
import PeriodDropDown from "../dashboard-page/PeriodDropDown";
import ProjectLanguagesTimeOnPeriodChart from "./charts/ProjectLanguagesTimeOnPeriodChart";
import ProjectTimeOnPeriodChart from "./charts/ProjectTimeOnPeriodChart";
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
    <main className="flex flex-col gap-x-10 gap-y-12 px-14 pb-4 text-black dark:text-white">
      <div className="flex flex-col gap-4">
        <LocalErrorBoundary>
          <SuspenseBoundary fallBackClassName="h-9 w-52">
            <ProjectTitle />
          </SuspenseBoundary>
        </LocalErrorBoundary>

        <div className="flex flex-wrap items-center gap-2 text-center text-2xl max-[25.625rem]:text-base">
          <PeriodDropDown />
          <LocalErrorBoundary>
            <SuspenseBoundary fallBackClassName="h-9 w-44">
              <TimeSpentOnProject />
            </SuspenseBoundary>
          </LocalErrorBoundary>
          <CustomRangeDatesSelector />
        </div>
      </div>

      <div className="flex items-center justify-between max-chart:flex-col max-chart:gap-20">
        <ErrorBoundary FallbackComponent={ErrorFallBack}>
          <SuspenseBoundary>
            <ProjectTimeOnPeriodChart />
          </SuspenseBoundary>
        </ErrorBoundary>

        <ErrorBoundary FallbackComponent={ErrorFallBack}>
          <SuspenseBoundary>
            <ProjectLanguagesTimeOnPeriodChart />
          </SuspenseBoundary>
        </ErrorBoundary>
      </div>

      <div className="flex items-center justify-between max-chart:flex-col max-chart:gap-20">
        <ErrorBoundary FallbackComponent={ErrorFallBack}>
          <SuspenseBoundary fallBackClassName="h-[24rem] w-full max-chart:w-full">
            <FilesCirclePackingChart />
          </SuspenseBoundary>
        </ErrorBoundary>
      </div>

      <div className="flex items-center justify-between max-chart:flex-col max-chart:gap-20">
        <FilesList />
      </div>
    </main>
  );
};

export default Project;
