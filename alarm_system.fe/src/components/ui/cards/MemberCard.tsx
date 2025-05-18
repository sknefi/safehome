import * as React from "react";
import { User } from "../../assets";
import { useUserStore } from "../../../providers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../dialog";
import { Button } from "../button";

interface MemberCardProps {
  member?: User;
  isOwner?: boolean;
  householdId?: string;
}

export const MemberCard: React.FC<MemberCardProps> = ({
  member,
  isOwner,
  householdId,
}) => {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();

  interface DtoOut {
    success: boolean;
  }

  interface DtoIn {
    memberId?: string;
  }

  const GATEWAY = import.meta.env.VITE_GATEWAY;
  const BEARER_TOKEN = useUserStore((state) => state.accessToken);
  const { mutate: removeUserMutation, isPending } = useMutation<
    DtoOut,
    Error,
    DtoIn
  >({
    mutationFn: async (data: DtoIn) => {
      const response = await axios.put<DtoOut>(
        `${GATEWAY}/household/remove-user/${householdId}`,
        { deleteUserId: data.memberId },
        {
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["household", householdId] });
      setOpen(false);
      toast.success("Remove successful", {
        description: `User ${member?.firstName} ${member?.lastName} has been removed successfully`,
      });
    },
    onError: (error: Error) => {
      toast.error("Remove failed", {
        description:
          (error as any).response?.data?.message ||
          `An error occurred while removing member ${member?.firstName} ${member?.lastName}`,
      });
    },
  });

  return (
    <>
      <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
              {member?.firstName?.charAt(0) || ""}
              {member?.lastName?.charAt(0) || ""}
            </div>
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {member?.firstName} {member?.lastName}
            </p>
            <p className="text-sm text-gray-500">{member?.email}</p>
          </div>
        </div>

        {isOwner && (
          <Button
            onClick={() => setOpen(true)}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            Remove
          </Button>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Remove Member</DialogTitle>
            <DialogDescription>
              Remove {member?.firstName} {member?.lastName} from household?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
              className="sm:order-first"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => removeUserMutation({ memberId: member?._id })}
              disabled={isPending}
            >
              {isPending ? "Removing..." : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
