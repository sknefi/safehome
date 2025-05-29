import * as React from "react";
import { Household } from "../components/assets";
import { HouseholdCard } from "../components/ui/cards";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useUser } from "../providers";
import { AlertCircle, HomeIcon, Loader2, PlusIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";

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

export const AdminHomepage: React.FC = () => {
  const [searchParams, setSearchParams] = React.useState("");
  const [searchBy, setSearchBy] = React.useState("householdId");

  const GATEWAY = import.meta.env.VITE_GATEWAY;
  const { userData } = useUser();
  const role = userData?.role;
  interface DtoOut {
    success: boolean;
    data: Household[];
  }

  const { accessToken: BEARER_TOKEN } = useUser();
  const adminSearch = useQuery<DtoOut, Error>({
    queryKey: ["adminSearch", searchParams, searchBy],
    queryFn: async () => {
      const { data } = await axios.get<DtoOut>(
        `${GATEWAY}/search/${searchBy}?input=${searchParams}`,
        {
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
        }
      );
      return data;
    },
    enabled: false,
    retry: 2,
  });

  const households = adminSearch.data?.data || [];

  //### improve skeleton + toolbar
  if (adminSearch.isFetching)
    return (
      <div className="flex flex-col items-center space-y-4 p-6">
        <Skeleton className="h-[125px] w-full max-w-[250px] rounded-xl" />
        <div className="w-full max-w-[250px] space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );

  /* if (adminSearch.error)
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="rounded-full bg-red-100 p-3 mb-4">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="font-medium text-lg mb-2">Error loading households</h3>
        <p className="text-gray-500">
          There was a problem loading your data. Please try again later.
        </p>
        <Button onClick={() => adminSearch.refetch()} className="mt-4">
          Try Again
        </Button>
      </div>
    ); */

  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Navbar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Input
              value={searchParams}
              onChange={(e) => setSearchParams(e.target.value)}
              placeholder="SearchBar"
              className="flex-1"
            />
            <Button
              onClick={() => adminSearch.refetch()}
              disabled={adminSearch.isFetching}
              className="flex items-center gap-2"
            >
              {adminSearch.isFetching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Searching</span>
                </>
              ) : (
                "Search"
              )}
            </Button>
          </div>

          <div className="mb-4">
            <p className="mb-2 font-medium">Search by:</p>
            <RadioGroup
              value={searchBy}
              onValueChange={setSearchBy}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="householdId" id="radio-id" />
                <Label htmlFor="radio-id">Household ID</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="name" id="radio-name" />
                <Label htmlFor="radio-name">Household Name</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ownerId" id="radio-owner" />
                <Label htmlFor="radio-owner">Household Owner</Label>
              </div>
            </RadioGroup>
          </div>

          {adminSearch.error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {adminSearch.error?.message ||
                  "Failed to perform search. Please try again."}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      <div>
        {households?.map((household) => (
          <HouseholdCard key={household._id} household={household} />
        ))}
      </div>
    </>
  );
};
