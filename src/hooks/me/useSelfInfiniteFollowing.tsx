import useSelfStudentLite from "./useSelfStudentLite";
import { useInfiniteQuery } from "@tanstack/react-query";
import client from "../../client";

const PAGE_SIZE = 13

const useSelfInfiniteFollowing = () => {
  const { student } = useSelfStudentLite();

  // fetch the student profiles of the followings
  const q = useInfiniteQuery({
    queryKey: ["self_infinite_followings"],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await client
        .from("student_followers")
        .select("*, student:students!student_followers_following_id_fkey(*)")
        .eq("follower_id", student!.id)
        .order("created_at", { ascending: false })
        .range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1);

      if (!res.data || res.error) return [];

      // extract the student profiles from the followings
      const students = res.data!.map((followings) => followings.student);
      console.log("following students", students);
      return students;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // Determine if there's more data to load
      return lastPage.length === PAGE_SIZE ? allPages.length : undefined;
    },
    enabled: !!student,
  });

  return q;
};

export default useSelfInfiniteFollowing;
