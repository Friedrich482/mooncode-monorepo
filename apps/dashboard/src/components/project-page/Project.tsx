import { useParams } from "react-router";

const Project = () => {
  const params = useParams();
  return <div>{params.projectName}</div>;
};

export default Project;
