import useSelfStudentLite from './useSelfStudentLite'
import { useQuery } from '@tanstack/react-query';
import client from '../../client';

const useSelfRecommendedGroups = () => {
  const { student } = useSelfStudentLite();
  const query = useQuery({
    queryKey: ["recommended_groups_history"],
    queryFn: async () => {
      // fetch the groups that is in the group_ids
      const res0 = await client
        .from("student_recommend_groups")
        .select("*")
        .eq("student_id", student?.id!)
        .limit(1)
        .order("created_at", { ascending: false })
        .single()

      if (!res0) {
        return [];
      }

      // console.log("recommended groups", res0);

      const res = await client
        .from("groups")
        .select("*, group_members!group_members_group_id_fkey(*, student:students(*))")
        .order("avatar_url", { ascending: false })
        .in("id", res0.data?.group_ids!)

      return res.data;
    },
    enabled: !!student?.id,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  })

  return {
    groups: query.data,
    query
  };
}

export default useSelfRecommendedGroups