import useGetTimeSpentOnProject from "@/hooks/useGetTimeSpentOnProject";

const ProjectTitle = () => {
  const data = useGetTimeSpentOnProject();

  return (
    <h1 className="text-3xl underline max-[25.625rem]:text-2xl">{data.name}</h1>
  );
};

export default ProjectTitle;
