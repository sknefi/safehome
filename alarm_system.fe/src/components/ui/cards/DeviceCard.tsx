import * as React from "react";
import { Device } from "../../assets";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../card";
import { AlertCircle, CheckCircle, Trash, XCircle } from "lucide-react";
import { Badge } from "../badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../tooltip";
import { useUser } from "../../../providers";
import { Button } from "../button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../dialog";

interface DeviceCardProps {
  device?: Device;
  householdId?: string;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({
  device,
  householdId,
}) => {
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const { userData } = useUser();
  const role = userData?.role;
  const GATEWAY = import.meta.env.VITE_GATEWAY;
  const { accessToken: BEARER_TOKEN } = useUser();
  const queryClient = useQueryClient();

  interface DtoOutDeleteDevice {
    success: boolean;
    message: string;
  }

  const {
    mutate: deleteHouseholdMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete<DtoOutDeleteDevice>(
        `${GATEWAY}/device/delete/${device?._id}`,
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
      toast.success("Delete successful", {
        description: "Device has been deleted successfully",
      });
    },
    onError: (error: any) => {
      toast.error("Delete failed", {
        description:
          error.response?.data?.message ||
          `An error occurred during device deletion`,
      });
    },
  });

  return (
    <>
      <Card
        className={`overflow-hidden ${
          device && device?.alarm_triggered > 0 && device?.active === true
            ? "border-red-500"
            : ""
        }`}
      >
        {device && device?.alarm_triggered > 0 && device?.active === true && (
          <div className="bg-red-500 text-white text-sm font-medium py-1 px-3 text-center">
            Alarm Triggered
          </div>
        )}

        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg">{device?.name}</CardTitle>
            <CardDescription>{device?.type}</CardDescription>
          </div>
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center ${
              device?.active ? "bg-green-100" : "bg-gray-100"
            }`}
          >
            {device?.active ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Device is active</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <XCircle className="h-5 w-5 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Device is not active</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Badge variant={device?.active ? "success" : "destructive"}>
                {device?.active ? "Active" : "Inactive"}
              </Badge>
            </div>

            {role === "admin" ? (
              <Button
                variant="outline"
                className="flex items-center text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300"
                onClick={() => setOpenDeleteDialog(true)}
              >
                <Trash className="h-4 w-4 mr-1" />
                Delete
              </Button>
            ) : (
              device &&
              device?.alarm_triggered > 0 &&
              device?.active === true && (
                <div className="flex items-center text-red-500">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span>
                    {device &&
                    device?.alarm_triggered > 0 &&
                    device?.active === true
                      ? "Security alert"
                      : null}
                  </span>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Device</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {device?.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setOpenDeleteDialog(false)}
              disabled={isPending}
              className="sm:order-first"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteHouseholdMutation()}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
