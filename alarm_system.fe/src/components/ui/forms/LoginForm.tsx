import * as React from "react";

import { Link, useNavigate } from "react-router-dom";
import { User } from "../../assets";

import { Input } from "../input";
import { Button } from "../button";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";
import { Eye, EyeOff } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useUser } from "../../../providers";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const FormSchema = z.object({
  email: z.string().email({
    message: "Email must be a valid address.",
  }),
  password: z.string(),
});

export const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);

  const { updateAccessToken, updateRefreshToken, updateUserData } = useUser();
  const navigate = useNavigate();

  type FormFields = z.infer<typeof FormSchema>;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  //### correct the output

  const GATEWAY = import.meta.env.VITE_GATEWAY;
  /* user login */
  interface DtoOut {
    accessToken: string;
    refreshToken: string;
    user: User;
  }

  const {
    mutate: loginMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (formData: FormFields) => {
      const { data } = await axios.post<DtoOut>(
        `${GATEWAY}/auth/login`,
        formData
      );
      return data;
    },
    onSuccess: (data) => {
      updateAccessToken(data.accessToken);
      updateRefreshToken(data.refreshToken);
      updateUserData(data.user);

      navigate("/homepage");

      toast.success("Login successful", {
        description: "You have been logged in successfully",
      });
    },
    onError: (error: any) => {
      toast.error("Login failed", {
        description:
          error.response?.data?.message || "An error occurred during login",
      });
    },
  });

  /* admin login */
  interface DtoOut {
    accessToken: string;
    refreshToken: string;
    admin: User;
  }

  const {
    mutate: loginAdminMutation,
    isPending: isPendingAdminLogin,
    error: errorAdminLogin,
  } = useMutation({
    mutationFn: async (formData: FormFields) => {
      const { data } = await axios.post<DtoOut>(
        `${GATEWAY}/admin/login`,
        formData
      );
      return data;
    },
    onSuccess: (data) => {
      updateAccessToken(data.accessToken);
      updateRefreshToken(data.refreshToken);
      updateUserData(data.admin);

      navigate("/homepage");

      toast.success("Admin login successful", {
        description: "You have been logged in successfully as admin",
      });
    },
    onError: (error: any) => {
      toast.error("Admin login failed", {
        description:
          error.response?.data?.message || "An error occurred during login",
      });
    },
  });

  function onSubmit(data: FormFields) {
    if (data.email === "admin@admin.cz") {
      loginAdminMutation(data);
    } else loginMutation(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <h1 className="text-2xl font-bold mb-2">Login</h1>
        <p className="text-gray-600 mb-6">
          Enter your credentials to access your account
        </p>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email:</FormLabel>
              <FormControl>
                <Input placeholder="example@mail.com" type="email" {...field} />
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
              <FormLabel>Password:</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="password"
                    type={showPassword ? "text" : "password"}
                    {...field}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Loading..." : "Login"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-primary hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </Form>
  );
};
