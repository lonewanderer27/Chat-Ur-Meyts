import useAmIAMember from './useAmIAMember'
import client from '../../client';
import useSelfStudentLite from '../me/useSelfStudentLite';
import { useState } from 'react';
import { useIonRouter } from '@ionic/react';

const useMeLeave = (groupVanityUrl: string) => {
  const [loading, setLoading] = useState(false);
  const rt = useIonRouter();
  const AIM = useAmIAMember(groupVanityUrl);
  const { student } = useSelfStudentLite();

  const leave = async () => {
    setLoading(() => true);
    const res = await client.from("group_members")
      .delete()
      .eq("student_id", student?.id!)
      .eq("group_vanity_id", groupVanityUrl);

    if (res.error) console.error("Error leaving group", res.error);
    setLoading(() => false);

    rt.push("/discover", "root", "pop");
    AIM.refetch();
    console.log("Left group", res);
  }

  return {
    loading,
    leave
  }
}

export default useMeLeave