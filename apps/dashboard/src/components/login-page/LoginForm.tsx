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
  LOGIN_URL,
  USER_NOT_FOUND_MESSAGE,
} from "@repo/utils/constants";
import { Link, useNavigate } from "react-router";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { SignInUserDto } from "@repo/utils/schemas";
import { SignInUserDtoType } from "@repo/utils/types";
import fetchJWTToken from "@repo/utils/fetchJWTToken";
import getCallbackUrl from "@/utils/getCallbackUrl";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";
import useTogglePassword from "@/hooks/useTogglePassword";
import { zodResolver } from "@hookform/resolvers/zod";

const LoginForm = () => {
  const form = useForm<SignInUserDtoType>({
    resolver: zodResolver(SignInUserDto),
    defaultValues: {
      email: "",
      password: "",
      callbackUrl: null,
    },
  });

  const { isPasswordVisible, EyeIconComponent } = useTogglePassword();

  const navigate = useNavigate();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const callbackUrl = getCallbackUrl();

  const onSubmit = async (values: SignInUserDtoType) => {
    try {
      // send the credentials to the backend and set an http cookie in the browser

      const token = await fetchJWTToken(LOGIN_URL, {
        email: values.email,
        password: values.password,
        callbackUrl,
      });

      if (callbackUrl) {
        window.location.href = callbackUrl + "&token=" + token;
      }

      await queryClient.invalidateQueries({
        queryKey: trpc.auth.getUser.queryKey(),
        exact: true,
      });

      navigate("/dashboard");
    } catch (error) {
      let errorMessage = "An error occurred";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      if (errorMessage === INCORRECT_PASSWORD_MESSAGE) {
        form.setError("password", { message: errorMessage });
      } else if (errorMessage === USER_NOT_FOUND_MESSAGE) {
        form.setError("email", { message: errorMessage });
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="example@email.com"
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
            )}
          />
          <p>
            Not registered yet ?{" "}
            <Link
              to={`/register${callbackUrl ? `?callback=${callbackUrl}` : ""}`}
              className="underline"
            >
              Sign Up
            </Link>
          </p>
          <Button
            variant="default"
            type="submit"
            disabled={form.formState.isSubmitting}
            className="h-10 w-1/2 self-center rounded-lg"
          >
            Log in
          </Button>
          <div className="h-4">
            {form.formState.errors.root && (
              <FormMessage>{form.formState.errors.root.message}</FormMessage>
            )}
          </div>
        </form>
      </Form>
    </main>
  );
};

export default LoginForm;
