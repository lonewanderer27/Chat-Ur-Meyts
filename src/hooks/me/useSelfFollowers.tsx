import useSelfStudentLite from './useSelfStudentLite'
import { useQuery } from '@tanstack/react-query';
import client from '../../client';

const useSelfFollowers = () => {
  const { student, profile } = useSelfStudentLite();

  // fetch the student profiles of the followers
  const followersQuery = useQuery({
    queryKey: ["student", student?.id, "followers"],
    queryFn: async () => {
      const res = await client
      .from("student_followers")
      .select("*, student:students!student_followers_following_id_fkey(*)")
      .eq("following_id", student!.id)
      .order("created_at", { ascending: false });

      // extract the student profiles from the followers
      const students = res.data!.map((follower) => follower.student);
      return students;
    },
    enabled: !!student,
  })

  return followersQuery;
}

export default useSelfFollowers