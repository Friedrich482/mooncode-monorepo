import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router";
import { LogOut, User } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AUTH_DROPDOWN_ITEMS } from "@/constants";
import GravatarAvatar from "./GravatarAvatar";
import Icon from "@/components/ui/Icon";
import { useTRPC } from "@/utils/trpc";

const AuthDropDown = () => {
  const trpc = useTRPC();
  const navigate = useNavigate();

  const mutation = useMutation(trpc.auth.logOut.mutationOptions());

  const { data } = useQuery(trpc.auth.getUser.queryOptions());

  if (!data) {
    return (
      <Link to="/login">
        <Icon Icon={User} />
      </Link>
    );
  }

  const { email, username } = data;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <GravatarAvatar email={email} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex w-48 -translate-x-2 flex-col gap-1 p-2">
        <div className="flex flex-col px-2 py-1">
          <p>{username}</p>
          <p className="text-sm opacity-50">{email}</p>
        </div>
        <DropdownMenuSeparator className="w-full" />
        {AUTH_DROPDOWN_ITEMS.map(({ Icon, text, url }) => (
          <DropdownMenuItem
            className="cursor-pointer rounded-md py-1 text-base"
            key={text}
          >
            <Icon className="size-5" />
            <Link to={url}>{text}</Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="w-full" />
        <DropdownMenuItem
          className="cursor-pointer rounded-md py-1 text-base"
          onClick={() => {
            mutation.mutate(undefined, {
              onSuccess: () => {
                navigate("/login");
              },
            });
          }}
        >
          <LogOut />
          Log Out{" "}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default AuthDropDown;
