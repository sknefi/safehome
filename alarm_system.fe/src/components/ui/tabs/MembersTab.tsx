import * as React from "react";
import { CirclePlus, Search, Users } from "lucide-react";
import { HouseholdWithOwner, User } from "../../assets";
import { AddMemberCard, MemberCard } from "../cards";
import { Button } from "../button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../dialog";
import { Label } from "@radix-ui/react-label";
import { Input } from "../input";
import { useUser } from "../../../providers";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`animate-pulse rounded-md bg-gray-200 ${className}`}
    {...props}
  />
);

interface MembersTabProps {
  isOwner?: boolean;
  household?: HouseholdWithOwner;
}

export const MembersTab: React.FC<MembersTabProps> = ({
  isOwner,
  household,
}) => {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearched, setIsSearched] = React.useState(false);
  const { userData } = useUser();
  const role = userData?.role;

  interface DtoOut {
    success: boolean;
    data: User[];
  }

  //### error handling
  const GATEWAY = import.meta.env.VITE_GATEWAY;
  const { accessToken: BEARER_TOKEN } = useUser();
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await axios.get<DtoOut>(`${GATEWAY}/user/users`, {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      });
      return data;
    },
    enabled: false,
    retry: 2,
  });

  const filteredUsers = React.useMemo(() => {
    if (!data?.data) return [];

    return data.data.filter((user: User) => {
      const isMember = household?.members?.some(
        (member) => member._id.toString() === user._id.toString()
      );

      const isOwner =
        household?.ownerId._id?.toString() === user._id.toString();

      if (isMember || isOwner) return false;

      const matchesSearch =
        user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [data?.data, searchQuery, household?.members, household?.ownerId]);

  const handleSearch = (e: any) => {
    e.preventDefault();
    setIsSearched(true);
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium">Members</h3>
        {(isOwner || role === "admin") && (
          <Button onClick={() => setOpen(true)}>
            <CirclePlus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {household?.ownerId && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Owner</h4>
            <MemberCard
              key={household.ownerId._id}
              member={household.ownerId}
              householdId={household._id}
              ownerId={household.ownerId._id}
            />
          </div>
        )}

        {household?.members && household.members.length > 0 ? (
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Members</h4>
            <div className="space-y-3">
              {household.members.map((member) => (
                <MemberCard
                  key={member._id}
                  member={member}
                  isOwner={isOwner}
                  householdId={household._id}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">
              No additional members in this household
            </p>
            {(isOwner || role === "admin") && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setOpen(true)}
              >
                <CirclePlus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            )}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Member</DialogTitle>
            <DialogDescription>
              Search for users and add them to your household
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search for user</Label>
              <div className="flex gap-2">
                <Input
                  id="search"
                  placeholder="Search by name or email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" variant="secondary">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-4">
            {isPending ? (
              <div className="space-y-2">
                <Skeleton className="h-14 w-full rounded-md" />
                <Skeleton className="h-14 w-full rounded-md" />
                <Skeleton className="h-14 w-full rounded-md" />
              </div>
            ) : (
              isSearched && (
                <div className="max-h-60 overflow-y-auto pr-1 space-y-2">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <AddMemberCard
                        key={user._id}
                        member={user}
                        householdId={household?._id}
                      />
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      No users found matching your search
                    </div>
                  )}
                </div>
              )
            )}
          </div>

          <DialogFooter>
            {/* ### reset input */}
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                setSearchQuery("");
              }}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
