import * as React from "react";
import { Device } from "../../assets";
import { DeviceCard } from "../cards";
import { Shield } from "lucide-react";

interface DeviceTabProps {
  devices?: Device[];
}

export const DevicesTab: React.FC<DeviceTabProps> = ({ devices }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium">Security Devices</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices && devices.length > 0 ? (
          devices?.map((device) => (
            <DeviceCard key={device._id} device={device} />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <Shield className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No devices added</h3>
            <p className="text-gray-500 mb-4">
              {/* change text */}
              Contact an admin to add your first security device to start
              monitoring.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
