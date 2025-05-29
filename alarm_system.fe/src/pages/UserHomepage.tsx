import * as React from "react";
import { Household } from "../components/assets";
import { ToolbarHomepage } from "../components/ui/toolbars";
import { HouseholdCard } from "../components/ui/cards";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useUser } from "../providers";
import { AlertCircle, HomeIcon, PlusIcon } from "lucide-react";
import { Button } from "../components/ui/button";

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

export const UserHomepage: React.FC = () => {
  const HouseholdCardSkeleton = () => (
    <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
      <div className="space-y-2 mb-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-20 rounded" />
      </div>
    </div>
  );

  const GATEWAY = import.meta.env.VITE_GATEWAY;
  interface DtoOut {
    success: boolean;
    data: Household[];
  }

  const { accessToken: BEARER_TOKEN } = useUser();
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["households"],
    queryFn: async () => {
      const { data } = await axios.get<DtoOut>(`${GATEWAY}/user`, {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      });
      return data;
    },
    retry: 2,
  });

  const households = data?.data || [];

  if (isPending)
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <HouseholdCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="rounded-full bg-red-100 p-3 mb-4">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="font-medium text-lg mb-2">Error loading households</h3>
        <p className="text-gray-500">
          There was a problem loading your data. Please try again later.
        </p>
        <Button onClick={() => refetch()} className="mt-4">
          Try Again
        </Button>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <ToolbarHomepage />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {households.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="rounded-full bg-blue-100 p-4 mb-4">
              <HomeIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-medium mb-2">No households yet</h3>
            <p className="text-gray-500 mb-6 max-w-md">
              Create your first household to start managing your home and
              inviting members.
            </p>
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Household
            </Button>
          </div>
        ) : (
          households?.map((household) => (
            <HouseholdCard key={household._id} household={household} />
          ))
        )}
      </div>
    </div>
  );
};
