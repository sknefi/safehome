import * as React from "react";
import { Device } from "../../assets";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../card";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "../badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../tooltip";

interface DeviceCardProps {
  device?: Device;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device }) => {
  return (
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

          {device && device?.alarm_triggered > 0 && device?.active === true && (
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
          )}
        </div>
      </CardContent>
    </Card>
  );
};
