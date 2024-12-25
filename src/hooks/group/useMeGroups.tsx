import React from 'react'
import useSelfStudent from '../student'
import { useQuery } from '@tanstack/react-query';
import client from '../../client';
import useSelfStudentLite from '../me/useSelfStudentLite';

const useMeGroups = () => {
  const { student } = useSelfStudentLite();

  const query = useQuery({
    queryKey: ['me-admin-groups', student?.id],
    queryFn: async () => {
      const res = await client
        .from("group_members")
        .select("group_id, group:groups!group_members_group_id_fkey(*)")
        .eq("student_id", student?.id+"")
      console.log("me-groups raw", res.data, res.error)

      const groups = res.data!.map((gm) => gm.group);
      console.log("me-groups", groups)
      return groups;
    },
    enabled: !!student,
  })

  return query;
}

export default useMeGroups