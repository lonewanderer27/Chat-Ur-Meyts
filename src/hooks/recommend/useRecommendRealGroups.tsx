import { useQuery } from '@tanstack/react-query';
import RecommendService from '../../services/recommend';
import useSelfStudentLite from '../student/useSelfStudentLite';
import client from '../../client';

const useRecommendRealGroups = () => {
  const { student } = useSelfStudentLite();
  const query = useQuery({
    queryKey: ["recommend_real_groups", student?.id],
    queryFn: async () => {
      console.log("useQuery");
      const data = await RecommendService.getRealGroups(student?.id!);
      console.log("recommended_real_groups:", data);
      
      // fetch the groups that is in the group_ids
      const res = await client
        .from("groups")
        .select("*, group_members!group_members_group_id_fkey(*, student:students(*))")
        .in("id", data.group_ids)
      console.log("recommended_groups:", res);

      return res.data;
    },
    enabled: !!student?.id,
  })

  return query;
}

export default useRecommendRealGroups