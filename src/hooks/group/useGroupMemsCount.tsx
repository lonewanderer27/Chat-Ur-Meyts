import { useQuery } from "@tanstack/react-query";
import client from "../../client";

const useGroupMemsCount = (vanity_url?: string) => {
  const q = useQuery({
    queryKey: ["group_members_count", vanity_url],
    queryFn: async () => {
      const groupRes = await client
        .from("group_members")
        .select("*", { count: "exact", head: true })
        .eq("group_vanity_id", vanity_url!)
        .eq("approved", true);

      return groupRes.count;
    },
    enabled: !!vanity_url,
  });

  return q;
};

export default useGroupMemsCount;
