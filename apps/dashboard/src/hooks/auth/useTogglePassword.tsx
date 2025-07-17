import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const useTogglePassword = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const handleEyeIconClick = () => setIsPasswordVisible((prev) => !prev);
  const EyeIconComponent = () => (
    <div
      className="absolute z-10 pr-2 text-white/60"
      onClick={handleEyeIconClick}
      title={`${isPasswordVisible ? "Hide" : "Show"} the password`}
    >
      {isPasswordVisible ? <EyeOff /> : <Eye />}
    </div>
  );

  return {
    isPasswordVisible,
    EyeIconComponent,
  };
};

export default useTogglePassword;
