import { useInfiniteQuery } from '@tanstack/react-query'
import client from '../../client'

const PAGE_SIZE = 13

const useStudentInfiniteGroups = (studentId?: string) => {
  const query = useInfiniteQuery({
    queryKey: ["infinite_student_groups", studentId],
    queryFn: async ({ pageParam = 0 }) => {
      // Get the groups that the student is a member of
      const res = await client
      .from("group_members")
      .select("*, group:group_id(*)")
      .eq("student_id", studentId!)
      .order("created_at", { ascending: false });
      
      if (!res.data || res.error) return [];

      // Get the group data
      const resG = await client
        .from("groups")
        .select("*")
        .in("id", res.data!.map((group_members) => group_members.group_id))
        .range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1);

      if (!resG.data || resG.error) return [];

      return resG.data;
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

export default useStudentInfiniteGroups