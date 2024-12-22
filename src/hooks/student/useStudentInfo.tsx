import { useQuery } from '@tanstack/react-query'
import React from 'react'
import client from '../../client'

const useStudentInfo = (studentId: string) => {
  const query = useQuery({
    queryKey: ["student", "lite", studentId],
    queryFn: async() => {
      const res = await client
        .from("students")
        .select("*")
        .eq("id", studentId)
        .single()
      return res.data
    }
  })

  return query;
}

export default useStudentInfo