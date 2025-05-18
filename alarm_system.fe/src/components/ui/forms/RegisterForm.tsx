import * as React from "react";

import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

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

const FormSchema = z.object({
  firstName: z
    .string()
    .min(3, {
      message: "First name must be at least 3 characters.",
    })
    .max(20, {
      message: "First name must be maximum 20 characters.",
    }),
  lastName: z
    .string()
    .min(3, {
      message: "Last name must be at least 3 characters.",
    })
    .max(20, {
      message: "Last name must be maximum 20 characters.",
    }),
  email: z
    .string()
    .email({
      message: "Email must be a valid address.",
    })
    .max(50, {
      message: "Email must be maximum 50 characters.",
    }),
  password: z
    .string()
    .min(8, {
      message: "Password must contain at least 8 characters.",
    })
    .max(30, {
      message: "Password must be maximum 30 characters.",
    }),
  confirmPassword: z
    .string()
    .min(8, {
      message: "Password must contain at least 8 characters.",
    })
    .max(30, {
      message: "Password must be maximum 30 characters.",
    }),
});

export const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
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
  interface DtoOut {
    success: boolean;
  }

  const { mutate: registrationMutation, isPending } = useMutation({
    mutationFn: async (formData: FormFields) => {
      const { data } = await axios.post<DtoOut>(
        `${GATEWAY}/auth/register`,
        formData
      );
      return data;
    },
    onSuccess: () => {
      navigate("/login");

      toast.success("Registration successful", {
        description: "Your account has been registred successfully",
      });
    },
    onError: (error: any) => {
      toast.error("Registration failed", {
        description:
          error.response?.data?.message ||
          "An error occurred during registration",
      });
    },
  });

  function onSubmit(data: FormFields) {
    registrationMutation(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <h1 className="text-2xl font-bold mb-2">Create an account</h1>
        <p className="text-gray-600 mb-6">
          Enter your information to create an account
        </p>

        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First name:</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last name:</FormLabel>
              <FormControl>
                <Input placeholder="Harris" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password:</FormLabel>
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
          {isPending ? "Loading..." : "Register"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </Form>
  );
};
