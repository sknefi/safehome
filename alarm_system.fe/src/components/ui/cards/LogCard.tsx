import * as React from "react";
import { Log } from "../../assets";
import { Activity, AlertCircle, AlertTriangle, Info, Key } from "lucide-react";

interface LogCardProps {
  log?: Log;
}

export const LogCard: React.FC<LogCardProps> = ({ log }) => {
  //### adjust types
  const getLogTypeIcon = (type: string | undefined) => {
    switch (type && type.toLowerCase()) {
      case "alert":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "info":
        return <Info className="h-5 w-5 text-gray-500" />;
      case "access":
        return <Key className="h-5 w-5 text-green-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">{getLogTypeIcon(log?.type)}</div>
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <p className="font-medium text-gray-900">{log?.type}</p>
            <p className="text-sm text-gray-500">{formatDate(log?.time)}</p>
          </div>
          <p className="text-gray-700 mt-1">{log?.message}</p>
        </div>
      </div>
    </div>
  );
};
