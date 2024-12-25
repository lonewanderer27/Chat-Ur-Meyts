import client from "../../client";
import useSession from "../auth/useSession";
import useSelfStudentLite from "../me/useSelfStudentLite";

export default function useSearch() {
  const { student } = useSelfStudentLite();
  const { session } = useSession();

  const handleSearch = async (query: string) => {
    // return if the session or student is not yet loaded or not available
    if (!session || !student) return;

    // update the search history
    if (query.length === 0) return;
    const response = await client.from("search_history").upsert({
      query: query,
      profile_id: session!.user.id,
      student_id: student!.id
    });

    console.log("handleSearch response:", response)
  }

  return {
    handleSearch
  }
}
