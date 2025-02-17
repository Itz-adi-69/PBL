"use client";
import React, { useTransition, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Heart, XCircle, Trash } from "lucide-react";
import { addInterest, cancelInterest, deleteGroup } from "@/app/actions/routes";

interface GroupProps {
  id: string;
  subject: string;
  description: string;
  contact: string;
  section: string;
  creator: { name: string };
  includeMe: boolean;
  myPost: boolean;
  acceptedMe: boolean;
}

const GroupCard = ({ group }: { group: GroupProps }) => {
  const [isPending, startTransition] = useTransition();
  const [optimisticIncludeMe, setOptimisticIncludeMe] = useState(
    group.includeMe
  );
  const [deleted, setDeleted] = useState(false);
  console.log(group.includeMe);
  console.log(group.myPost);

  const handleInterest = async (groupId: string) => {
    setOptimisticIncludeMe(true);
    startTransition(async () => {
      try {
        await addInterest(groupId);
      } catch (error) {
        setOptimisticIncludeMe(false);
      }
    });
  };

  const handleCancelInterest = async (groupId: string) => {
    setOptimisticIncludeMe(false);
    startTransition(async () => {
      try {
        await cancelInterest(groupId);
      } catch (error) {
        setOptimisticIncludeMe(true);
      }
    });
  };

  const handleDelete = async (groupId: string) => {
    setDeleted(true);
    startTransition(async () => {
      try {
        await deleteGroup(groupId);
      } catch (error) {
        setDeleted(false);
        alert("Failed to delete group. Please try again.");
      }
    });
  };

  if (deleted) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{group.subject}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-2">{group.description}</p>
        <p className="text-sm text-gray-500 mb-2">
          Created by: {group.creator.name} from {group.section}
        </p>
        <p className="text-sm text-gray-500 mb-4">Contact: {group.contact}</p>

        {/* Green Accepted Button */}
        {group.acceptedMe ? (
          <Button className="bg-green-500 text-white hover:bg-green-600">
            Accepted
          </Button>
        ) : group.myPost ? (
          <Button
            variant="destructive"
            onClick={() => handleDelete(group.id)}
            disabled={isPending}
          >
            <Trash className="mr-2 h-4 w-4" />
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        ) : optimisticIncludeMe ? (
          <div className="flex gap-2">
            <Button disabled className="bg-[#D4A017] text-white">
              Request Pending
            </Button>
            <Button
              onClick={() => handleCancelInterest(group.id)}
              disabled={isPending}
              variant="destructive"
            >
              <XCircle className="mr-2 h-4 w-4" />
              {isPending ? "Cancelling..." : "Cancel Request"}
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={() => handleInterest(group.id)}
              disabled={isPending}
            >
              <Heart className="mr-2 h-4 w-4" />
              {isPending ? "Processing..." : "Show Interest"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GroupCard;
