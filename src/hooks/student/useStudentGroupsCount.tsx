import { useQuery } from '@tanstack/react-query';
import client from '../../client';

const useStudentGroupsCount = (studentId?: string) => {
  const query = useQuery({
    queryKey: ["student_groups_count", studentId],
    queryFn: async () => {
      // Get the groups that the student is a member of
      const res = await client
      .from("group_members")
      .select("*, group:group_id(*)")
      .eq("student_id", studentId!)
      .order("created_at", { ascending: false });
      if (!res.data || res.error) return 0;

      // Get the group data
      const resG = await client
        .from("groups")
        .select("id")
        .in("id", res.data!.map((group_members) => group_members.group_id))
      if (!resG.data || resG.error) return 0;

      return resG.data.length;
    },
    enabled: !!studentId
  });

  return query;
}

export default useStudentGroupsCount