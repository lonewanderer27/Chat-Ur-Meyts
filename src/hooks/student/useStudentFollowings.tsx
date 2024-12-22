import { useQuery } from '@tanstack/react-query'
import client from '../../client'

const useStudentFollowings = (studentId: string) => {
  const query = useQuery({
    queryKey: ["studentFollowings", studentId],
    queryFn: async() => {
      // fetch the following ids
      const followingRes = await client
        .from("student_followers")
        .select("*")
        .eq("follower_id", studentId)

      // fetch the students that are following
      const students = await client
        .from("students")
        .select("*", { count: "exact" })
        .in("id", followingRes!.data!.map((f) => f.following_id))
        .order("created_at", { ascending: false })

      return students.data
    }
  })

  return query;
}

export default useStudentFollowings