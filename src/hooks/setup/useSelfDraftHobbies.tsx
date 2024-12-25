import useSelfDraftStudent from '../me/useSelfDraftStudent'
import { useQuery } from '@tanstack/react-query';
import client from '../../client';

const useSelfDraftHobbies = () => {
  const { data: student } = useSelfDraftStudent();

  const query = useQuery({
    queryKey: ['selfStudentHobbies'],
    queryFn: async () => {
      // fetch the ids of the hobbies
      const rawHobbies = await client
        .from("draft_student_hobbies")
        .select("*")
        .eq("draft_student_id", student!.id)

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

  return query;
}

export default useSelfDraftHobbies