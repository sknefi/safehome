import * as React from "react";
import { HouseholdWithOwner } from "../../assets";
import { Input } from "../input";
import { Button } from "../button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../tooltip";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useUser } from "../../../providers";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Pause, Play, Trash2, XCircle } from "lucide-react";
import { getWebSocketUrl } from "../../../utils/websocket";

interface SettingsTabProps {
  household?: HouseholdWithOwner;
  goBack: () => void;
  isActive: boolean;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  household,
  goBack,
  isActive,
}) => {
  const [openActivateDialog, setOpenActivateDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [inputName, setInputName] = React.useState(household?.name || "");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const householdId = household?._id;
  const GATEWAY = import.meta.env.VITE_GATEWAY;
  const { accessToken: BEARER_TOKEN } = useUser();
  const { userData } = useUser();
  const role = userData?.role;

  //########
  const adminSearch = role === "admin" ? "add-user-admin" : "add-user";

  const hasDevices = React.useMemo(
    () => (household?.devices?.length ?? 0) > 0,
    [household?.devices]
  );

  /* delete household */
  interface DtoOutDeleteHousehold {
    success: boolean;
    message: string;
  }

  const adminDelete = role === "admin" ? "delete-admin" : "delete";
  const {
    mutate: deleteHouseholdMutation,
    isPending: isPendingDeleteHousehold,
    error: errorDeleteHousehold,
  } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete<DtoOutDeleteHousehold>(
        `${GATEWAY}/household/${adminDelete}/${householdId}`,
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
      navigate("/homepage");
      queryClient.invalidateQueries({ queryKey: ["household", householdId] });
      toast.success("Delete successful", {
        description: "Your household has been deleted successfully",
      });
    },
    onError: (error: any) => {
      toast.error("Delete failed", {
        description:
          error.response?.data?.message ||
          `An error occurred during deletion of household ${householdId}`,
      });
    },
  });

  /* update household name */
  interface DtoOutUpdateHouseholdName {
    success: boolean;
  }
  interface DtoInUpdateHouseholdName {
    newName: string;
  }

  const adminChangeName =
    role === "admin" ? "update-name-admin" : "update-name";
  const {
    mutate: updateHouseholdNameMutation,
    isPending: isPendingUpdateHouseholdName,
  } = useMutation<DtoOutUpdateHouseholdName, Error, DtoInUpdateHouseholdName>({
    mutationFn: async (data: DtoInUpdateHouseholdName) => {
      const response = await axios.put<DtoOutUpdateHouseholdName>(
        `${GATEWAY}/household/${adminChangeName}/${householdId}`,
        { name: data.newName },
        {
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["household", householdId] });
      toast.success("Update successful", {
        description: `Household name has been changed successfully.`,
      });
    },
    onError: (error: Error) => {
      toast.error("Update failed", {
        description:
          (error as any).response?.data?.message ||
          `An error occurred while updating household name.`,
      });
    },
  });

  /* activate household with websockets*/
  interface DtoOutActivateHousehold {
    success: boolean;
    message?: string;
  }
  interface DtoInActivateHousehold {
    activateHouseholdId?: string;
  }

  const {
    mutate: activateHouseholdMutation,
    isPending: isPendingActivateHousehold,
  } = useMutation<DtoOutActivateHousehold, Error, DtoInActivateHousehold>({
    mutationFn: async (data: DtoInActivateHousehold) => {
      return new Promise<DtoOutActivateHousehold>((resolve, reject) => {
        if (!BEARER_TOKEN) {
          return reject(new Error("Authentication token is missing"));
        }
        const socket = new WebSocket(getWebSocketUrl(), [BEARER_TOKEN]);

        socket.onopen = () => {
          socket.send(
            JSON.stringify({
              action: "setStateActive",
              householdId: data.activateHouseholdId,
            })
          );
        };

        socket.onmessage = (event) => {
          try {
            const response = JSON.parse(event.data);
            socket.close();
            response.success
              ? resolve(response)
              : reject(new Error(response.message));
          } catch (error) {
            socket.close();
            reject(new Error("Invalid response format"));
          }
        };

        socket.onerror = () => {
          reject(new Error("Connection failed. Check if server is running."));
        };

        setTimeout(() => {
          if (socket.readyState === WebSocket.CONNECTING) {
            socket.close();
            reject(new Error("Connection timeout"));
          }
        }, 10000);
      });
    },
    onSuccess: () => {
      setOpenActivateDialog(false);
      queryClient.invalidateQueries({
        queryKey: ["household", householdId],
      });
      toast.success("State change successful", {
        description: `Household has been successfully set to active.`,
      });
    },
    onError: (error: Error) => {
      toast.error("State change failed", {
        description:
          error.message ||
          `An error occurred while changing the state of your household.`,
      });
    },
  });

  /* deactivate household */
  interface DtoOutDeactivateHousehold {
    success: boolean;
  }
  interface DtoInDeactivateHousehold {
    deactivateHouseholdId?: string;
  }

  const {
    mutate: deactivateHouseholdMutation,
    isPending: isPendingDeactivateHousehold,
  } = useMutation<DtoOutDeactivateHousehold, Error, DtoInDeactivateHousehold>({
    mutationFn: async (data: DtoInDeactivateHousehold) => {
      return new Promise<DtoOutDeactivateHousehold>((resolve, reject) => {
        if (!BEARER_TOKEN) {
          return reject(new Error("Authentication token is missing"));
        }
        const socket = new WebSocket(getWebSocketUrl(), [BEARER_TOKEN]);

        socket.onopen = () => {
          socket.send(
            JSON.stringify({
              action: "setStateDeactive",
              householdId: data.deactivateHouseholdId,
            })
          );
        };

        socket.onmessage = (event) => {
          try {
            const response = JSON.parse(event.data);
            socket.close();
            response.success
              ? resolve(response)
              : reject(new Error(response.message));
          } catch (error) {
            socket.close();
            reject(new Error("Invalid response format"));
          }
        };

        socket.onerror = () => {
          reject(new Error("Connection failed. Check if server is running."));
        };

        setTimeout(() => {
          if (socket.readyState === WebSocket.CONNECTING) {
            socket.close();
            reject(new Error("Connection timeout"));
          }
        }, 10000);
      });
    },
    onSuccess: () => {
      setOpenActivateDialog(false);
      queryClient.invalidateQueries({
        queryKey: ["household", householdId],
      });
      toast.success("State change successful", {
        description: `Household has been successfully set to deactive.`,
      });
    },
    onError: (error: Error) => {
      toast.error("State change failed", {
        description:
          (error as any).response?.data?.message ||
          `An error occurred while changing the state of your household.`,
      });
    },
  });

  return (
    <div className="space-y-8 p-6 bg-white rounded-lg border border-gray-200">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <h2 className="text-xl font-medium">Settings</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => goBack()}
          className="text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Go back</span>
        </Button>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-md font-medium text-gray-700">
            Household Status
          </h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600">
                Change the state of your household
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {!hasDevices && "Your household does not include any devices"}
                {hasDevices && isActive && "Your household is currently active"}
                {hasDevices &&
                  !isActive &&
                  "Your household is currently inactive"}
              </p>
            </div>
            {hasDevices ? (
              <Button
                variant="outline"
                size="sm"
                className={
                  isActive
                    ? "text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                    : "text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                }
                onClick={() => setOpenActivateDialog(true)}
              >
                {isActive ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Activate
                  </>
                )}
              </Button>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <XCircle className="h-5 w-5 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>State cannot be set because there are no devices.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-gray-100">
          <h3 className="text-md font-medium text-gray-700">
            Household Details
          </h3>
          <div className="space-y-2">
            <label htmlFor="household-name" className="text-gray-600 block">
              Change household name
            </label>
            <div className="flex space-x-2">
              <Input
                id="household-name"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className="max-w-md"
                placeholder="Enter household name"
              />
              <Button
                size="sm"
                className="bg-gray-900 hover:bg-gray-800 text-white"
                onClick={() =>
                  updateHouseholdNameMutation({ newName: inputName })
                }
                disabled={isPendingUpdateHouseholdName}
              >
                {isPendingUpdateHouseholdName ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-gray-100">
          <h3 className="text-md font-medium text-gray-700 text-red-600">
            Danger Zone
          </h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600">Delete household</p>
              <p className="text-sm text-gray-500 mt-1">
                This action cannot be undone
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
              onClick={() => setOpenDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* acivate / deactivate household dialog */}
      <Dialog open={openActivateDialog} onOpenChange={setOpenActivateDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isActive ? "Deactivate" : "Activate"} Household
            </DialogTitle>
            <DialogDescription>
              Do you want to {isActive ? "deactivate" : "activate"}{" "}
              {household?.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setOpenDeleteDialog(false)}
              disabled={isPendingDeleteHousehold}
              className="sm:order-first"
            >
              Cancel
            </Button>

            {isActive ? (
              <Button
                variant="outline"
                onClick={() =>
                  deactivateHouseholdMutation({
                    deactivateHouseholdId: householdId,
                  })
                }
                disabled={isPendingDeactivateHousehold}
                className="text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700 flex items-center"
              >
                <Pause className="h-4 w-4 mr-2" />
                {isPendingDeactivateHousehold
                  ? "Deactivating..."
                  : "Deactivate"}
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() =>
                  activateHouseholdMutation({
                    activateHouseholdId: householdId,
                  })
                }
                disabled={isPendingActivateHousehold}
                className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 flex items-center"
              >
                <Play className="h-4 w-4 mr-2" />
                {isPendingActivateHousehold ? "Activating..." : "Activate"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* delete household dialog*/}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Household</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {household?.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setOpenDeleteDialog(false)}
              disabled={isPendingDeleteHousehold}
              className="sm:order-first"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteHouseholdMutation()}
              disabled={isPendingDeleteHousehold}
            >
              {isPendingDeleteHousehold ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
