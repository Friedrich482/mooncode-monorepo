import { Eye, EyeOff } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  INCORRECT_PASSWORD_MESSAGE,
  USER_NOT_FOUND_MESSAGE,
} from "@repo/utils/constants";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { SignInUserDto } from "@repo/utils/schemas";
import { SignInUserDtoType } from "@repo/utils/schemas";
import fetchJWTToken from "@repo/utils/fetchJWTToken";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

const LoginForm = () => {
  const form = useForm<SignInUserDtoType>({
    resolver: zodResolver(SignInUserDto),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // state for the hide/show password option
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

  const navigate = useNavigate();

  const onSubmit = async (values: SignInUserDtoType) => {
    try {
      // send the credentials to the backend and set an http cookie in the browser
      await fetchJWTToken(values.username, values.password);
      navigate("/dashboard");
      // TODO communicate the jwt returned by this function to the extension
    } catch (error) {
      let errorMessage = "An error occurred";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      if (errorMessage === INCORRECT_PASSWORD_MESSAGE) {
        form.setError("password", { message: errorMessage });
      } else if (errorMessage === USER_NOT_FOUND_MESSAGE) {
        form.setError("username", { message: errorMessage });
      } else {
        form.setError("root", { message: errorMessage });
      }
    }
  };

  return (
    <main className="flex flex-col items-center justify-center pb-8 pt-16 text-black dark:text-white">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-[clamp(15rem,60%,25rem)] flex-col gap-8"
        >
          <h2 className="text-center text-3xl text-black dark:text-white max-sm:text-2xl">
            Login to MoonCode
          </h2>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Friedrich"
                    {...field}
                    className="h-10 focus-visible:ring-moon/65"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <>
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative flex items-center justify-end gap-2">
                    <FormControl>
                      <Input
                        placeholder="**********"
                        {...field}
                        type={isPasswordVisible ? "text" : "password"}
                        className="h-10 flex-nowrap focus-visible:ring-moon/65"
                      />
                    </FormControl>
                    <EyeIconComponent />
                  </div>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          <Button type="submit" className="h-10 w-1/2 self-center rounded-lg">
            Log in
          </Button>
        </form>
      </Form>
    </main>
  );
};

export default LoginForm;
