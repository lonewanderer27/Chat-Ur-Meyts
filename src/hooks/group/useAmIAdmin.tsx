import React from 'react'
import useSelfStudentLite from '../me/useSelfStudentLite';
import { useQuery } from '@tanstack/react-query';
import client from '../../client';

const useAmIAdmin = (group_vanity_id: string) => {
  const { profile } = useSelfStudentLite();
  const query = useQuery({
    queryKey: [group_vanity_id, "am_i_admin"],
    queryFn: async () => {
      console.log("am i admin", group_vanity_id, profile!.id);

      const res = await client
        .from("group_members")
        .select("id")
        .eq("profile_id", profile!.id)
        .eq("group_vanity_id", group_vanity_id)
        .eq("is_admin", true)
        .single()

      console.log("am i admin", res);
      return res.data
    },
    enabled: !!group_vanity_id && !!profile
  })

  return query;
}

export default useAmIAdmin