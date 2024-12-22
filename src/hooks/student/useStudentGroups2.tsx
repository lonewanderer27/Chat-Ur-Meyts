import { useQuery } from "@tanstack/react-query";
import client from "../../client";

const useStudentGroups2 = (studentId: string) => {
  const query = useQuery({
    queryKey: ["studentGroups", studentId],
    queryFn: async () => {
      // Get the groups that the student is a member of
      const res = await client
      .from("group_members")
      .select("*, group:group_id(*)")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false });
      console.log("groups_members data: ", res.data);

      // Get the group data
      const resG = await client
        .from("groups")
        .select("*, group_members_group_id_fkey!group_members(*)")
        .in("id", res.data!.map((group_members) => group_members.group_id))
      console.log("groups data: ", resG.data);

      return resG.data;
    },
  });

  return query;
};

export default useStudentGroups2;
