import { useEffect } from "react";
import { useNavigate } from "react-router";

const RedirectToNotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/not-found", { replace: true });
  }, [navigate]);

  return <></>;
};

export default RedirectToNotFound;
