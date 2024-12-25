import { useQuery } from "@tanstack/react-query";
import useSelfStudentLite from "../me/useSelfStudentLite";
import client from "../../client";
import { useState } from "react";
import useFeatureFlags from "../useFeatureFlags";
import useAmIAMember from "./useAmIAMember";

const useMePendingRequest = (group_vanity_id: string, groupId: string) => {
  const { flags, loading, error } = useFeatureFlags();
  // Check if enable_bypass_group_request_to_join feature flag is enabled
  const enableBypassGroupJoinRequest = (flags["enable_bypass_group_request_to_join"]?.value as unknown as boolean) ?? false;
  
  const AIM = useAmIAMember(group_vanity_id);
  const { profile, student } = useSelfStudentLite();
  const [joining, setJoining] = useState(false);
  const query = useQuery({
    queryKey: [group_vanity_id, "did_i_requested_to_be_a_member", profile?.id],
    queryFn: async () => {
      console.log(
        "did i requested to be a member",
        group_vanity_id,
        profile?.id
      );
      const { data } = await client
        .from("group_members")
        .select("*")
        .eq("profile_id", profile!.id)
        .eq("group_vanity_id", group_vanity_id)
        .eq("approved", false)
        .maybeSingle();

      return data;
    },
  });

  const requesToJoin = async () => {
    setJoining(() => true);
    if (enableBypassGroupJoinRequest) {
      const res = await client.from("group_members")
        .insert({
          student_id: student?.id!,
          profile_id: profile?.id!,
          group_id: Number(groupId!),
          group_vanity_id: group_vanity_id!,
          is_admin: false,
          approved: true, // Bypass group join request
          creator: false,
        });

        if (res.error) console.error("Error joining group", res.error);
        console.log("Bypassed group join request", res);
    } else {
      const res = await client.from("group_members").insert({
        student_id: student?.id!,
        profile_id: profile?.id!,
        group_id: Number(groupId!),
        group_vanity_id: group_vanity_id!,
        is_admin: false,
        approved: false,  // Request to join group
        creator: false,
      });

      if (res.error) console.error("Error joining group", res.error);
      console.log("Request to join group", res);
    }
    
    const promises = [query.refetch(), AIM.refetch()]
    Promise.all(promises);
    setJoining(() => false);
  };

  const cancelPendingRequest = async () => {
    setJoining(true);
    const res = await client
      .from("group_members")
      .delete()
      .eq("profile_id", profile!.id)
      .eq("group_vanity_id", group_vanity_id)
      .eq("approved", false);
    await query.refetch();
    console.log("cancel pending request", res);
    setJoining(false);
  }

  return {
    ...query,
    toggleJoin: requesToJoin,
    cancelPendingRequest,
    joining
  };
};

export default useMePendingRequest;
