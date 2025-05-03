import React from "react";
import md5 from "js-md5";

type GravatarProps = {
  email: string;
  size?: number;
  defaultType?: string;
};
const GravatarAvatar = React.forwardRef<
  HTMLImageElement,
  GravatarProps & React.HTMLAttributes<HTMLImageElement>
>(({ email, defaultType = "identicon", ...props }, ref) => {
  const hash = md5.md5(email);
  const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?d=${defaultType}`;

  return (
    <div className="self-center">
      <img
        className="size-8 cursor-pointer rounded-full hover:bg-accent"
        src={gravatarUrl}
        alt="User Avatar"
        ref={ref}
        {...props}
      />
    </div>
  );
});

export default GravatarAvatar;
