import { useQuery } from '@tanstack/react-query'
import useSelfStudentLite from '../me/useSelfStudentLite'
import { getAdminPosts } from '../../services/group/admin';

const useIAnnouncements = () => {
  const { student } = useSelfStudentLite();

  const query = useQuery({
    queryKey: ["important_announcements"],
    queryFn: async () => {
      const res = await getAdminPosts(student!.school + "");
      console.log("adminPosts", res);
      return res;
    },
    enabled: !!student?.id,
  })

  return {
    iAnnouncements: query.data,
    query
  }
}

export default useIAnnouncements