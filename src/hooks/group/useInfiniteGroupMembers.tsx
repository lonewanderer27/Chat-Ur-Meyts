import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import client from "../../client"

const PAGE_SIZE = 13

const useInfiniteGroupMembers = (vanity_url?: string, approved?: boolean) => {
  const q = useInfiniteQuery({
    queryKey: ["infinite_group_members", vanity_url, approved],
    queryFn: async ({ pageParam = 0 }) => {
      // Fetch the group_id using the vanity_url from the groups table
      const res0 = await client
        .from("groups")
        .select("id")
        .eq("vanity_id", vanity_url!)
        .single()

      if (!res0.data || res0.error) return []

      const res = await client
        .from("group_members")
        .select("*, student:students(*)")
        .eq("group_id", res0.data.id)
        .eq("approved", approved ? true : false)
        .order("created_at", { ascending: false })
        .range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1);

      if (!res.data || res.error) return []
      return res.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // Determine if there's more data to load
      return lastPage.length === PAGE_SIZE ? allPages.length : undefined;
    },
    enabled: !!vanity_url
  })

  return q;
}

export default useInfiniteGroupMembers