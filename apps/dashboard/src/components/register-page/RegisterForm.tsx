import {
  ALREADY_EXISTING_EMAIL_MESSAGE,
  ALREADY_EXISTING_USERNAME_MESSAGE,
  REGISTER_URL,
} from "@repo/utils/constants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { RegisterUserDto } from "@repo/utils/schemas";
import { RegisterUserDtoType } from "@repo/utils/types";
import fetchJWTToken from "@repo/utils/fetchJWTToken";
import { useForm } from "react-hook-form";
import useTogglePassword from "@/hooks/useTogglePassword";
import { zodResolver } from "@hookform/resolvers/zod";

const RegisterForm = () => {
  const form = useForm<RegisterUserDtoType>({
    resolver: zodResolver(RegisterUserDto),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  const { isPasswordVisible, EyeIconComponent } = useTogglePassword();
  const navigate = useNavigate();

  const onSubmit = async (values: RegisterUserDtoType) => {
    try {
      await fetchJWTToken(REGISTER_URL, {
        email: values.email,
        username: values.username,
        password: values.password,
      });
      navigate("/dashboard");
      // TODO communicate the jwt returned by this function to the extension
    } catch (error) {
      let errorMessage = "An error occurred";
      console.error(error);

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      if (errorMessage === ALREADY_EXISTING_EMAIL_MESSAGE) {
        form.setError("email", { message: errorMessage });
      } else if (errorMessage === ALREADY_EXISTING_USERNAME_MESSAGE) {
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
            Register
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
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="example"
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
          <p>
            Already registered ?{" "}
            <Link to="/login" className="underline">
              Log in
            </Link>
          </p>
          <Button
            variant="default"
            type="submit"
            disabled={form.formState.isSubmitting}
            className="h-10 w-1/2 self-center rounded-lg"
          >
            Register
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

export default RegisterForm;
