import useProfile from '../profile/useProfile';
import { useQuery } from '@tanstack/react-query';
import client from '../../client';
import useSession from '../auth/useSession';

const useSelfStudentLite = () => {
  const { session } = useSession();
  const { profile } = useProfile();

  const query = useQuery({
    queryKey: ['student', 'lite'],
    queryFn: async () => {
      const res = await client
        .from("students")
        .select("*")
        .eq("profile_id", session?.user.id!)
        .single();

      return res.data;
    },
    enabled: !!session
  })

  return {
    profile: profile ?? null,
    student: query.data ?? null,
    query
  }
}

export default useSelfStudentLite;