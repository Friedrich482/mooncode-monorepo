import { Eye, EyeOff } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { SignInUserDto } from "@repo/utils/schemas";
import { SignInUserDtoType } from "@repo/utils/schemas";
import { useForm } from "react-hook-form";
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

  function onSubmit(values: SignInUserDtoType) {
    // TODO add fetch call and error handling
    console.warn(values);
  }

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
                  <FormControl>
                    <div className="relative flex items-center justify-end gap-2">
                      <Input
                        placeholder="**********"
                        {...field}
                        type={isPasswordVisible ? "text" : "password"}
                        className="h-10 flex-nowrap focus-visible:ring-moon/65"
                      />

                      <EyeIconComponent />
                    </div>
                  </FormControl>
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
