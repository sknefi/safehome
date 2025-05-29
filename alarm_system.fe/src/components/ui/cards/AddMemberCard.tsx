import * as React from "react";
import { User } from "../../assets";
import { useUser } from "../../../providers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "../button";

interface AddMemberCardProps {
  member?: User;
  householdId?: string;
}

export const AddMemberCard: React.FC<AddMemberCardProps> = ({
  member,
  householdId,
}) => {
  const queryClient = useQueryClient();

  interface DtoOut {
    success: boolean;
  }

  interface DtoIn {
    memberId?: string;
  }

  const GATEWAY = import.meta.env.VITE_GATEWAY;
  const { accessToken: BEARER_TOKEN } = useUser();
  const { mutate: addUserMutation, isPending } = useMutation<
    DtoOut,
    Error,
    DtoIn
  >({
    mutationFn: async (data: DtoIn) => {
      const response = await axios.put<DtoOut>(
        `${GATEWAY}/household/add-user/${householdId}`,
        { newUserId: data.memberId },
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
      toast.success("Action successful", {
        description: `User ${member?.firstName} ${member?.lastName} has been added successfully`,
      });
    },
    onError: (error: Error) => {
      toast.error("Action failed", {
        description:
          (error as any).response?.data?.message ||
          `An error occurred while adding member ${member?.firstName} ${member?.lastName}`,
      });
    },
  });

  return (
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

      <Button
        onClick={() => addUserMutation({ memberId: member?._id })}
        size="sm"
        className="bg-gray-900 hover:bg-gray-700 text-white"
      >
        Add
      </Button>
    </div>
  );
};
