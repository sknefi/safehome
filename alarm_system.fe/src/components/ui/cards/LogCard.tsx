import * as React from "react";
import { Log } from "../../assets";
import { Activity, AlertCircle, Power, PowerOff, Trash } from "lucide-react";
import { Button } from "../button";
import { useUser } from "../../../providers";
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

interface LogCardProps {
  log?: Log;
  householdId?: string;
}

export const LogCard: React.FC<LogCardProps> = ({ log, householdId }) => {
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
    mutate: deleteLogMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete<DtoOutDeleteDevice>(
        `${GATEWAY}/log/delete/${log?._id}`,
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

  const getLogTypeIcon = (type: string | undefined) => {
    switch (type && type.toLowerCase()) {
      case "alarm":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "activation":
        return <Power className="h-5 w-5 text-green-500" />;
      case "deactivation":
        return <PowerOff className="h-5 w-5 text-gray-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };

  const getLogTypeLabel = (type: string | undefined) => {
    if (!type) return "Unknown";
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <>
      <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">{getLogTypeIcon(log?.type)}</div>
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <p className="font-medium text-gray-900">
                {getLogTypeLabel(log?.type)}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500">
                  {formatDate(log?.createdAt)}
                </p>
                {role === "admin" ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
                    onClick={() => setOpenDeleteDialog(true)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
            </div>
            <p className="text-gray-700 mt-1">{log?.message}</p>
          </div>
        </div>
      </div>

      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Log</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this log?
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
              onClick={() => deleteLogMutation()}
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
