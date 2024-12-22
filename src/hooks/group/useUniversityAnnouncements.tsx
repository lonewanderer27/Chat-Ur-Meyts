import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import useSelfStudentLite from '../student/useSelfStudentLite';
import client from '../../client';
import { GroupType } from '../../types';

const useUniversityAnnouncements = () => {
  const [group, setGroup] = useState<GroupType>();
  const { student } = useSelfStudentLite();
  const query = useQuery({
    queryKey: ["university_announcements"],
    queryFn: async () => {
      const grp = await client
        .from("groups")
        .select("*")
        .eq("admin_uni_group", true)
        .eq("school_id", student!.school)
        .single();

      if (!grp.data) {
        return [];
      }
      setGroup(grp.data);

      const res = await client
        .from("group_posts")
        .select("*")
        .eq("group_id", grp.data.id)
        .order("created_at", { ascending: false });

      return res.data ?? [];
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false
  })

  return {
    universityAnnouncements: query.data,
    group,
    query
  }
}

export default useUniversityAnnouncements