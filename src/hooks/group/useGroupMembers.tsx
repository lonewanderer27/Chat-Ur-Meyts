import { useState } from "react";
import client from "../../client";
import { useQuery } from "@tanstack/react-query";
import { GroupType } from "../../types";

export default function useGroupMembers(vanity_url?: string, approved?: boolean) {
  const [group, setGroup] = useState<GroupType | null>(null);
  const q = useQuery({
    queryKey: ["group_members", vanity_url, approved],
    queryFn: async () => {
      // Fetch the group_id using the vanity_url from the groups table
      const groupRes = await client
        .from("groups")
        .select("*")
        .eq("vanity_id", vanity_url!)
        .single();

      if (!groupRes.data) {
        throw new Error("Group not found");
      }
      setGroup(groupRes.data);
      const group_id = groupRes.data.id;

      // Fetch the group members using the group_id
      const memberRes = await client
        .from("group_members")
        .select("*, student:students(*)")
        .eq("group_id", group_id)
        .eq("approved", approved ? true : false)
        .order("created_at", { ascending: false });

      return memberRes.data;
    },
    enabled: !!vanity_url,
  });

  return {
    ...q,
    group: group
  }
}
