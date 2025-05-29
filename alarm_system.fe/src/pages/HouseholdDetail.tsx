import * as React from "react";
import { useParams } from "react-router-dom";
import { Device, HouseholdWithOwner } from "../components/assets";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  AlertTriangle,
  History,
  Pause,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import axios from "axios";
import { useUser } from "../providers";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
// Create a simple Skeleton component inline
const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`animate-pulse rounded-md bg-gray-200 ${className}`}
    {...props}
  />
);
import { SettingsTab } from "../components/ui/tabs/SettingsTab";
import { DevicesTab } from "../components/ui/tabs/DevicesTab";
import { MembersTab } from "../components/ui/tabs/MembersTab";
import { LogsTab } from "../components/ui/tabs/LogsTab";

export const HouseholdDetail: React.FC = () => {
  const [openAlarmDialog, setOpenAlarmDialog] = React.useState(false);
  const [openSettings, setOpenSettings] = React.useState(false);

  const { householdId } = useParams<{ householdId: string }>();
  const queryClient = useQueryClient();

  interface DtoOutGetHousehold {
    success: boolean;
    data: HouseholdWithOwner;
    isOwner: boolean;
  }

  const GATEWAY = import.meta.env.VITE_GATEWAY;
  const { accessToken: BEARER_TOKEN } = useUser();
  const { userData } = useUser();
  const role = userData?.role;

  /* fetch household data by id */
  const {
    data: householdData,
    isPending: isPendingGetHousehold,
    error: errorGetHousehold,
    refetch: getHouseholdRefetch,
  } = useQuery({
    queryKey: ["household", householdId],
    queryFn: async () => {
      const roleGet = role === "admin" ? "admin/whole-admin" : "user/whole";
      const { data } = await axios.get<DtoOutGetHousehold>(
        `${GATEWAY}/${roleGet}/${householdId}`,
        {
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
        }
      );
      return data;
    },
    retry: 2,
  });

  const household = householdData?.data;

  /* turn off alarm household */
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
        const socket = new WebSocket(`ws://localhost:3000/ws`, [BEARER_TOKEN]);

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
      setOpenAlarmDialog(false);
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

  const isActive: boolean = React.useMemo(() => {
    return Array.isArray(household?.devices)
      ? household.devices.every((device) => device.active === true)
      : false;
  }, [household?.devices]);

  const triggeredDevices: Device[] = React.useMemo(
    () =>
      Array.isArray(household?.devices)
        ? household.devices.filter(
            (device) => device.alarm_triggered === 1 && device.active === true
          )
        : [],
    [household?.devices]
  );

  React.useEffect(() => {
    if (triggeredDevices.length > 0 && householdData?.isOwner) {
      setOpenAlarmDialog(true);
      setOpenSettings(false);
    }
  }, [triggeredDevices]);

  if (isPendingGetHousehold)
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-9 w-24" />
      </div>
      <Skeleton className="h-5 w-96 mb-8" />

      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />

        <div className="grid grid-cols-1 gap-4 mt-6">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    </div>;

  if (errorGetHousehold)
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="rounded-full bg-red-100 p-3 mb-4">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="font-medium text-lg mb-2">Error loading household</h3>
        <p className="text-gray-500">
          There was a problem loading your data. Please try again later.
        </p>
        <Button onClick={() => getHouseholdRefetch()} className="mt-4">
          Try Again
        </Button>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">
            {household?.name}
          </h1>
          {isActive ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <span className="w-2 h-2 mr-1.5 rounded-full bg-green-500"></span>
              Active
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              <span className="w-2 h-2 mr-1.5 rounded-full bg-gray-500"></span>
              Inactive
            </span>
          )}
        </div>

        {householdData?.isOwner || role === "admin" ? (
          <Button
            variant="outline"
            size="sm"
            className="text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-600"
            onClick={() => setOpenSettings(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        ) : null}
      </div>

      <p className="text-gray-500 mb-8">
        Manage your household devices, members, and security settings
      </p>

      {openSettings ? (
        <SettingsTab
          household={household}
          goBack={() => setOpenSettings(false)}
          isActive={isActive}
        />
      ) : (
        <Tabs defaultValue="devices" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="devices">
              <Shield className="h-4 w-4 mr-2" />
              Devices
            </TabsTrigger>
            <TabsTrigger value="members">
              <Users className="h-4 w-4 mr-2" />
              Members
            </TabsTrigger>
            <TabsTrigger value="logs">
              <History className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="devices" className="space-y-3">
            <DevicesTab
              devices={householdData?.data.devices}
              householdId={householdData?.data._id}
              isPendingGet={isPendingGetHousehold}
            />
          </TabsContent>
          <TabsContent value="members" className="space-y-3">
            <MembersTab
              isOwner={householdData?.isOwner}
              household={householdData?.data}
            />
          </TabsContent>
          <TabsContent value="logs" className="space-y-3">
            <LogsTab
              logs={householdData?.data.logs}
              householdId={householdId}
            />
          </TabsContent>
        </Tabs>
      )}

      {/* alarm dialog */}
      <Dialog open={openAlarmDialog} onOpenChange={setOpenAlarmDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Security Alert
            </DialogTitle>
            <DialogDescription className="text-gray-700">
              Alarm triggered at your property. Please verify and respond.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setOpenAlarmDialog(false)}
              className="sm:order-first"
            >
              Cancel
            </Button>

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
              {isPendingDeactivateHousehold ? "Deactivating..." : "Deactivate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
