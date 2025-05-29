import * as React from "react";
import { Log } from "../../assets";
import { Activity, AlertCircle, Power, PowerOff } from "lucide-react";

interface LogCardProps {
  log?: Log;
}

export const LogCard: React.FC<LogCardProps> = ({ log }) => {
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
    <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">{getLogTypeIcon(log?.type)}</div>
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <p className="font-medium text-gray-900">
              {getLogTypeLabel(log?.type)}
            </p>
            <p className="text-sm text-gray-500">
              {formatDate(log?.createdAt)}
            </p>
          </div>
          <p className="text-gray-700 mt-1">{log?.message}</p>
        </div>
      </div>
    </div>
  );
};
