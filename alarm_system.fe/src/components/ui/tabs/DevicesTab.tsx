import * as React from "react";
import { Device } from "../../assets";
import { DeviceCard } from "../cards";
import { CirclePlus, Shield } from "lucide-react";
import { useUser } from "../../../providers";
import { Button } from "../button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";
import { Input } from "../input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface DeviceTabProps {
  devices?: Device[];
  householdId?: string;
  isPendingGet?: boolean;
}

const FormSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Device name must be at least 3 characters.",
    })
    .max(50, {
      message: "Device name must be maximum 50 characters.",
    }),
  type: z
    .string()
    .min(3, {
      message: "Type of device must be at least 3 characters.",
    })
    .max(50, {
      message: "Type of device must be maximum 50 characters.",
    }),
  hw_id: z
    .string()
    .min(3, {
      message: "Device HW id must be at least 3 characters.",
    })
    .max(20, {
      message: "Device HW id must be maximum 20 characters.",
    }),
});

export const DevicesTab: React.FC<DeviceTabProps> = ({
  devices,
  householdId,
  isPendingGet,
}) => {
  const [open, setOpen] = React.useState(false);
  const { userData } = useUser();
  const role = userData?.role;

  const queryClient = useQueryClient();
  type FormFields = z.infer<typeof FormSchema>;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      type: "",
      hw_id: "",
    },
  });

  interface DtoOut {
    success: boolean;
    data: Device[];
  }

  const GATEWAY = import.meta.env.VITE_GATEWAY;
  const { accessToken: BEARER_TOKEN } = useUser();
  const {
    mutate: createDeviceMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (formData: FormFields) => {
      const { data } = await axios.post<DtoOut>(
        `${GATEWAY}/device/create`,
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
      queryClient.invalidateQueries({ queryKey: ["household", householdId] });
      toast.success("Creation successful", {
        description: "New device has been created successfully",
      });
      setOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast.error("Creation failed", {
        description:
          error.response?.data?.message ||
          "An error occurred during the creation of device",
      });
    },
  });

  function onSubmit(data: FormFields) {
    if (!householdId) {
      toast.error("Missing household ID");
      return;
    }

    createDeviceMutation({
      ...data,
      householdId, // Injected here
    });
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium">Security Devices</h3>
        {role === "admin" && (
          <Button onClick={() => setOpen(true)}>
            <CirclePlus className="h-4 w-4 mr-2" />
            Add Device
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices && devices.length > 0 ? (
          devices?.map((device) => (
            <DeviceCard
              key={device._id}
              device={device}
              householdId={householdId}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <Shield className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No devices added</h3>
            {role === "admin" ? null : (
              <p className="text-gray-500 mb-4">
                Contact an admin to add your first security device to start
                monitoring.
              </p>
            )}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Device</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, (err) =>
                console.error("Form errors:", err)
              )}
              className="w-full space-y-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Device Name:</FormLabel>
                    <FormControl>
                      <Input placeholder="" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Device Type:</FormLabel>
                    <FormControl>
                      <Input placeholder="" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hw_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hardware Id:</FormLabel>
                    <FormControl>
                      <Input placeholder="" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" disabled={isPending} className="w-full">
                  {/* ### spinner */}
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
