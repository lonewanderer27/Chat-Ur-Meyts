import { SearchHistoryType } from "../../types";
import client from "../../client";
import useProfile from "../profile/useProfile";
import { useQuery } from "@tanstack/react-query";
import useSelfStudentLite from "../me/useSelfStudentLite";

export default function useSearchHistory() {
  const { profile } = useProfile();
  const { student } = useSelfStudentLite();
  // const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  const shQuery = useQuery({
    queryKey: ["search_history"],
    queryFn: async () => {
      const res = await client
        .from("search_history")
        .select("*")
        .order("created_at", { ascending: false })
        .eq("profile_id", profile!.id)
        .eq("hide", false)
        .limit(20) // add limit to fetch only the last 30 items
      return res.data;
    },
    enabled: !!profile && !!student,
    refetchOnWindowFocus: true,
  })

  // useEffect(() => {
  //   // query the previous search history
  //   shQuery.refetch();

  //   // subscribe to the search history changes
  //   const channel = client
  //     .channel("search_history_changes")
  //     .on(
  //       "postgres_changes",
  //       {
  //         event: "*",
  //         schema: "public",
  //         table: "search_history",
  //       },
  //       (payload) => {
  //         // payload will contain the new data
  //         const newp = payload.new as SearchHistoryType;

  //         // compare if the payload's id is the same as the current profile id
  //         if (newp.id === Number(profile!.id)) {
  //           setSearchHistory((prev) => [...prev, newp]);
  //         }
  //       }
  //     )
  //     .subscribe();

  //   return () => {
  //     channel.unsubscribe();
  //   };
  // }, [profile]);

  const handleHide = async (id: number) => {
    // hide from the search history
    const response = await client
      .from("search_history")
      .update({
        hide: true,
      })
      .eq("id", id).select("*").single();

    // log the removed search item
    console.log("handleHide response:", response);

    if (!response.error) {
      // remove the search history from the atom state
      // setSearchHistory(prev => {
      //   return prev.filter(item => item.id !== id)
      // })
      shQuery.refetch();
    }
  };

  return {
    searchHistory: shQuery.data as SearchHistoryType[] | undefined,
    isLoading: shQuery.isLoading,
    handleHide,
  };
}
