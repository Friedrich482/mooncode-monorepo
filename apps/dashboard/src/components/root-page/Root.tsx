import { useEffect } from "react";
import { useNavigate } from "react-router";

const Root = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard");
  }, []);

  return <></>;
};

export default Root;
