import { useQuery } from "@tanstack/react-query";
import client from "../../client";

const useStudentFollowingCount = (studentId?: string) => {
  const q = useQuery({
    queryKey: ["student_following_count", studentId],
    queryFn: async () => {
      const res0 = await client
        .from("student_followers")
        .select("*")
        .eq("follower_id", studentId!);
      
      // fetch the count of students that are following
      const res = await client
        .from("students")
        .select("id", { count: "exact" })
        .in("id", res0!.data!.map((f) => f.following_id))
        .order("created_at", { ascending: false })

      return res.count;
    },
    enabled: !!studentId,
  });

  return q;
};

export default useStudentFollowingCount;
