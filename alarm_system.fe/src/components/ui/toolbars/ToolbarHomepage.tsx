import * as React from "react";
import { useUserStore } from "../../../providers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Household } from "../../assets";

import { CirclePlus } from "lucide-react";
import { Button } from "../button";
import { Input } from "../input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";

const FormSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Name of household must be at least 3 characters.",
    })
    .max(50, {
      message: "Name of household must be maximum 50 characters.",
    }),
});

export const ToolbarHomepage: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();
  type FormFields = z.infer<typeof FormSchema>;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });
  //### correct the output
  interface DtoOut {
    success: boolean;
    data: Household[];
  }

  const GATEWAY = import.meta.env.VITE_GATEWAY;
  const BEARER_TOKEN = useUserStore((state) => state.accessToken);
  const {
    mutate: createHouseholdMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (formData: FormFields) => {
      const { data } = await axios.post<DtoOut>(
        `${GATEWAY}/household/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["households"] });
      toast.success("Creation successful", {
        description: "Your household has been created successfully",
      });
      setOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast.error("Creation failed", {
        description:
          error.response?.data?.message ||
          "An error occurred during the creation of household",
      });
    },
  });

  function onSubmit(data: FormFields) {
    createHouseholdMutation(data);
  }

  return (
    <div className="flex justify-between items-center py-4 mb-6">
      <h1 className="text-2xl font-bold tracking-tight">My Households</h1>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <CirclePlus className="h-5 w-5" />
            Add Household
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Household</DialogTitle>
            <DialogDescription>
              Create a new household to manage your security devices.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Household Name:</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="My Household"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the name of your household.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? "Loading..." : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
