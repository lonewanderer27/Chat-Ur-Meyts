import { useQuery } from '@tanstack/react-query';
import client from '../../client';
import useSession from '../auth/useSession';

const useSelfDraftStudent = () => {
  const { session } = useSession();

  const draftStudentQuery = useQuery({
    queryKey: ['draftStudent', session?.user.id!],
    queryFn: async () => {
      const { data, error } = await client
        .from("draft_students")
        .select("*")
        .eq("user_id", session?.user.id!)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error(error);
        throw new Error(error.message);  // Throwing an error for React Query to catch
      }

      return data;
    },
    enabled: !!session,
    retry: 2
  });

  return draftStudentQuery; // Return the query result to the component
};

export default useSelfDraftStudent
