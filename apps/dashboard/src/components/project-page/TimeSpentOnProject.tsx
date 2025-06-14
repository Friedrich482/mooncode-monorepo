import formatDuration from "@repo/utils/formatDuration";
import useGetTimeSpentOnProject from "@/hooks/useGetTimeSpentOnProject";

const TimeSpentOnProject = () => {
  const data = useGetTimeSpentOnProject();

  return (
    <span className="text-nowrap">{formatDuration(data.totalTimeSpent)}</span>
  );
};

export default TimeSpentOnProject;
