import { useInfiniteQuery } from '@tanstack/react-query'
import client from '../../client'

const PAGE_SIZE = 13

const useStudentInfiniteFollowing = (studentId?: string) => {
  const query = useInfiniteQuery({
    queryKey: ["infinite_student_following", studentId],
    queryFn: async ({ pageParam = 0 }) => {
      // fetch the following ids
      const followingRes = await client
        .from("student_followers")
        .select("*")
        .eq("follower_id", studentId!)

      if (!followingRes.data || followingRes.error) return [];

      // fetch the students that are following
      const students = await client
        .from("students")
        .select("*", { count: "exact" })
        .in("id", followingRes!.data!.map((f) => f.following_id))
        .order("created_at", { ascending: false })
        .range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1);

      if (!students.data || students.error) return [];

      return students.data
    },
    enabled: !!studentId,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // Determine if there's more data to load
      return lastPage.length === PAGE_SIZE ? allPages.length : undefined;
    },
  })

  return query;
}

export default useStudentInfiniteFollowing