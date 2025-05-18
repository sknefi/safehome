import * as React from "react";
import { Log } from "../../assets";
import { LogCard } from "../cards/LogCard";
import { ClipboardList } from "lucide-react";

interface LogsTabProps {
  logs?: Log[];
}

export const LogsTab: React.FC<LogsTabProps> = ({ logs }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium">Security Logs</h3>
      </div>

      {logs && logs.length > 0 ? (
        <div className="space-y-4">
          {logs.map((log) => (
            <LogCard key={log._id} log={log} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <ClipboardList className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No logs available</h3>
          <p className="text-gray-500 mb-4">
            Activity logs will appear here once your security devices are
            active.
          </p>
        </div>
      )}
    </div>
  );
};
