import { useQuery } from "@tanstack/react-query";
import client from "../../client";
import useSelfStudentLite from "../student/useSelfStudentLite";

const useSelfFollowingCount = () => {
  const { student } = useSelfStudentLite();

  const q = useQuery({
    queryKey: ["self_followings_count"],
    queryFn: async () => {
      const res = await client
        .from("student_followers")
        .select("*", { count: "exact", head: false })
        .eq("follower_id", student!.id)
      console.log(res);

      return res.count;
    },
    enabled: !!student,
  });

  return q;
};

export default useSelfFollowingCount;
