import { GroupType } from "..";

export type GroupPostTypeWGroupInfo = {
  content: string | null;
  created_at: string;
  group_id: number;
  id: number;
  image_url: string | null;
  member_id: number;
  pinned: boolean;
  student_id: number;
  title: string | null;
  groups: GroupType;
};