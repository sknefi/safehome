import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Log } from "../../assets";
import { LogCard } from "../cards/LogCard";
import { ClipboardList } from "lucide-react";

interface LogsTabProps {
  logs?: Log[];
}

const PAGE_SIZE = 20;

export const LogsTab: React.FC<LogsTabProps> = ({ logs = [] }) => {
  const sortedLogs = React.useMemo(
    () =>
      [...logs].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [logs]
  );

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loader = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) =>
            Math.min(prev + PAGE_SIZE, sortedLogs.length)
          );
        }
      },
      { threshold: 1.0 }
    );

    if (loader.current) observer.observe(loader.current);

    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [sortedLogs.length]);

  const visibleLogs = sortedLogs.slice(0, visibleCount);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium">Security Logs</h3>
      </div>

      {visibleLogs.length > 0 ? (
        <div className="space-y-4">
          {visibleLogs.map((log) => (
            <LogCard key={log._id} log={log} />
          ))}
          {visibleLogs.length < sortedLogs.length && (
            <div ref={loader} className="h-10"></div> // trigger load more
          )}
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
