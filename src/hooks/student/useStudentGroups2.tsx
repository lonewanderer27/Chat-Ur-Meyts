import { useQuery } from "@tanstack/react-query";
import client from "../../client";
import { useState } from "react";

const useStudentGroups2 = (studentId?: string) => {
  const [count, setCount] = useState(0);
  const query = useQuery({
    queryKey: ["student_groups_2", studentId],
    queryFn: async () => {
      // Get the groups that the student is a member of
      const res = await client
      .from("group_members")
      .select("*, group:group_id(*)")
      .eq("student_id", studentId!)
      .order("created_at", { ascending: false });
      if (!res.data || res.error) return [];
      console.log("groups_members data: ", res.data);

      // Get the group data
      const resG = await client
        .from("groups")
        .select("*, group_members_group_id_fkey!group_members(*)", { count: "exact" })
        .in("id", res.data!.map((group_members) => group_members.group_id))
      if (!resG.data || resG.error) return [];

      console.log("groups data: ", resG.data);
      setCount(resG.count ?? 0)

      return resG.data;
    },
    enabled: !!studentId,
  });

  return { ...query, count };
};

export default useStudentGroups2;
