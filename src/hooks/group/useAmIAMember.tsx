import { useQuery } from '@tanstack/react-query'
import useSelfStudentLite from '../me/useSelfStudentLite'
import client from '../../client';

const useAmIAMember = (group_vanity_id: string) => {
  const { profile } = useSelfStudentLite();
  const query = useQuery({
    queryKey: [group_vanity_id, "am_i_member", profile?.id],
    queryFn: async () => {
      console.log("am i member", group_vanity_id, profile?.id);

      const res = await client
        .from("group_members")
        .select("*")
        .eq("profile_id", profile!.id)
        .eq("group_vanity_id", group_vanity_id)
        .single()

      // console.log("am i member", res);
      return res.data
    },
    enabled: !!group_vanity_id && !!profile
  })

  return query;
}

export default useAmIAMember