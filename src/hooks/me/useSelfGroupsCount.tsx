import { useQuery } from '@tanstack/react-query';
import useSelfStudentLite from './useSelfStudentLite';
import client from '../../client';

const useSelfGroupsCount = () => {
  const { student } = useSelfStudentLite();
  const query = useQuery({
    queryKey: ["self_groups_count"],
    queryFn: async () => {
      // Get the groups that the student is a member of
      const res = await client
        .from("group_members")
        .select("group_id")
        .eq("student_id", student!.id)
        .order("created_at", { ascending: false });

      if (!res.data || res.error) return 0;
      console.log("group members\n", res.data);

      // Get the group data
      const resG = await client
        .from("groups")
        .select("id", { count: "exact", head: true })
        .in("id", res.data!.map((group_members) => group_members.group_id))

      if (!resG.data || resG.error) return 0;
      console.log("group data:\n", res.data);

      return resG.count;
    },
    enabled: !!student
  })

  return query;
}

export default useSelfGroupsCount