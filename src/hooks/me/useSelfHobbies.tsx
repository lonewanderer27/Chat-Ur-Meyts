import { useQuery } from "@tanstack/react-query"
import client from "../../client"
import useSelfStudentLite from "./useSelfStudentLite";

const useSelfHobbies = () => {
  const { student } = useSelfStudentLite();

  const ssHQ = useQuery({
    queryKey: ["selfStudentHobbies"],
    queryFn: async() => {
      // fetch the ids of the hobbies
      const rawHobbies = await client
        .from("student_hobbies")
        .select("*")
        .eq("student_id", student!.id)

      if (!rawHobbies.data) return []

      // fetch the hobbies
      const hobbies = await client
        .from("hobbies")
        .select("*")
        .order("title", { ascending: true })
        .in("id", rawHobbies.data.map((hobby) => hobby.hobby_id))

      return hobbies.data
    },
    enabled: !!student
  })

  return {
    hobbies: ssHQ.data ?? [],
    query: ssHQ
  }
}

export default useSelfHobbies;