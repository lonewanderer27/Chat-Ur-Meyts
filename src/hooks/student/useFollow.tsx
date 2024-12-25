import React from "react";
import useSelfStudentLite from "../me/useSelfStudentLite";
import { useQuery } from "@tanstack/react-query";
import client from "../../client";

const useFollow = (toFollowStudentId: string) => {
  const { profile } = useSelfStudentLite();
  const [loading, setLoading] = React.useState(false);
  const query = useQuery({
    queryKey: ["follow", profile?.id],
    queryFn: async () => {
      const { data, error } = await client
        .from("student_followers")
        .select("*")
        .eq("follower_id", profile?.student[0].id!)
        .eq("following_id", toFollowStudentId)
        .single();
      console.log("follow", data, error);
      return data;
    },
  });

  const requesToFollow = async () => {
    setLoading(true);
    const { data, error } = await client.from("student_followers").insert({
      follower_id: profile?.student[0].id!,
      following_id: Number(toFollowStudentId)!,
    });
    console.log("follow", data, error);
    await query.refetch();
    setLoading(false);
  };

  const unfollow = async () => {
    setLoading(true);
    const { data, error } = await client
      .from("student_followers")
      .delete()
      .eq("follower_id", profile?.student[0].id!)
      .eq("following_id", toFollowStudentId);
    console.log("unfollow", data, error);
    await query.refetch();
    setLoading(false);
  };

  return {
    ...query,
    requesToFollow,
    unfollow,
    loading,
  }
};

export default useFollow;
