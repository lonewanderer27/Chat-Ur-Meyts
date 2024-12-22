import { useQuery } from '@tanstack/react-query'
import client from '../../client'
import { useState } from 'react'

const useStudentFollowings = (studentId: string) => {
  const [count, setCount] = useState(0)
  const query = useQuery({
    queryKey: ["student_followings", studentId],
    queryFn: async () => {
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

      setCount(students.count ?? 0);

      return students.data
    }
  })

  return {
    ...query,
    count
  };
}

export default useStudentFollowings