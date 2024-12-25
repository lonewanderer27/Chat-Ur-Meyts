import { useQuery } from "@tanstack/react-query"
import client from "../../client"
import useSelfStudentLite from "./useSelfStudentLite";

const useSelfSubjects = () => {
  const { student } = useSelfStudentLite();

  const sssHQ = useQuery({
    queryKey: ["selfStudentSubjects"],
    queryFn: async() => {
      // fetch the ids of the subjects
      const rawSubjects = await client
        .from("students_subjects")
        .select("*")
        .eq("student_id", student!.id)

      if (!rawSubjects.data) return []

      // fetch the subjects
      const subjects = await client
        .from("subjects")
        .select("*")
        .in("id", rawSubjects.data.map((subject) => subject.subject_id))

      return subjects.data
    },
    enabled: !!student
  })

  return {
    subjects: sssHQ.data ?? [],
    query: sssHQ
  }
}

export default useSelfSubjects;