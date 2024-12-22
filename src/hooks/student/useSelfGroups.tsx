import useSelfStudentLite from './useSelfStudentLite'
import { useQuery } from '@tanstack/react-query';
import client from '../../client';

const useSelfGroups = () => {
  const { student } = useSelfStudentLite();

  const groupMembersQuery = useQuery({
    queryKey: ["student", student?.id, "group_members"],
    queryFn: async () => {
      const res = await client
      .from("group_members")
      .select("*")
      .eq("student_id", student!.id)
      .order("created_at", { ascending: false });

      return res.data;
    },
    enabled: !!student,
  })

  const groupsQuery = useQuery({
    queryKey: ["student", student?.id, "groups"],
    queryFn: async () => {
      const res = await client
      .from("groups")
      .select("*, group_members!group_members_group_id_fkey(*)")
      .in(
        "id",
        groupMembersQuery.data!.map((groupMember) => groupMember.group_id)
      ).eq("admin_uni_group", false)

      return res.data;
    },
    enabled: !!groupMembersQuery.data,
  })

  return groupsQuery;
}

export default useSelfGroups