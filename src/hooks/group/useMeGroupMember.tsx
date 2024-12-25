import { useQuery } from '@tanstack/react-query'
import React from 'react'
import useSelfStudentLite from '../me/useSelfStudentLite'
import client from '../../client';

const useMeGroupMember = (group_vanity_id: string) => {
  const { profile } = useSelfStudentLite();
  const query = useQuery({
    queryKey: ['me_group_member'],
    queryFn: async () => {
      const res = await client
        .from('group_members')
        .select('*')
        .eq("student_id", profile?.student[0].id!)
        .eq("group_vanity_id", group_vanity_id)
        .single();
      return res.data
    },
    enabled: !!profile
  })

  return query;
}

export default useMeGroupMember