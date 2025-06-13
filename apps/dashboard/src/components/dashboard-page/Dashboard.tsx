import DashboardTitle from "./DashboardTitle";
import DayLanguagesChart from "./charts/dayLanguagesChart/DayLanguagesChart";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallBack from "../suspense/ErrorFallback";
import GeneralStatsChart from "./charts/GeneralStatsChart";
import PeriodLanguagesChart from "./charts/PeriodLanguagesChart";
import PeriodProjects from "./charts/PeriodProjects";
import PeriodTimeChart from "./charts/PeriodTimeChart";
import SuspenseBoundary from "../suspense/SuspenseBoundary";

const Dashboard = () => {
  document.title = "MoonCode | Dashboard";
  return (
    <main className="flex flex-col gap-x-10 gap-y-12 px-14 pb-4 text-black dark:text-white">
      <DashboardTitle />
      <div className="flex items-center justify-between max-chart:flex-col max-chart:gap-20">
        <ErrorBoundary FallbackComponent={ErrorFallBack}>
          <SuspenseBoundary>
            <PeriodTimeChart />
          </SuspenseBoundary>
        </ErrorBoundary>
        <ErrorBoundary FallbackComponent={ErrorFallBack}>
          <SuspenseBoundary>
            <PeriodLanguagesChart />
          </SuspenseBoundary>
        </ErrorBoundary>
      </div>
      <div className="flex items-center justify-between max-chart:flex-col max-chart:gap-20">
        <ErrorBoundary FallbackComponent={ErrorFallBack}>
          <SuspenseBoundary>
            <DayLanguagesChart />
          </SuspenseBoundary>
        </ErrorBoundary>
        <ErrorBoundary FallbackComponent={ErrorFallBack}>
          <SuspenseBoundary>
            <GeneralStatsChart />
          </SuspenseBoundary>
        </ErrorBoundary>
      </div>
      <div className="flex items-center justify-between max-chart:flex-col max-chart:gap-20">
        <ErrorBoundary FallbackComponent={ErrorFallBack}>
          <SuspenseBoundary fallBackClassName="h-[24rem] w-full max-chart:w-full">
            <PeriodProjects />
          </SuspenseBoundary>
        </ErrorBoundary>
      </div>
    </main>
  );
};

export default Dashboard;
