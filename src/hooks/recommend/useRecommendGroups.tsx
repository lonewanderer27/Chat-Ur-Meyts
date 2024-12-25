import { useQuery } from '@tanstack/react-query';
import RecommendService from '../../services/recommend';
import useSelfStudentLite from '../me/useSelfStudentLite';

const useRecommendGroups = () => {
  const { profile } = useSelfStudentLite();
  const query = useQuery({
    queryKey: ["recommend_groups", profile?.id],
    queryFn: async () => {
      console.log("useQuery");
      const data = await RecommendService.getGroups(profile?.id!);
      console.log("recommended_groups:", data);
      return data;
    },
    enabled: !!profile?.id,
  })

  return query;
}

export default useRecommendGroups