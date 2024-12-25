import { useQuery } from "@tanstack/react-query"
import useSelfStudentLite from "../me/useSelfStudentLite";
import RecommendService from "../../services/recommend";

const useRecommendStudents = () => {
  const { profile } = useSelfStudentLite();
  const query = useQuery({
    queryKey: ["recommend_students", profile?.id],
    queryFn: async () => {
      console.log("useQuery");
      const data = await RecommendService.getStudents(profile?.id!);
      console.log("recommended_students:", data);
      return data;
    },
    enabled: !!profile?.id,
  })

  return query;
}

export default useRecommendStudents;