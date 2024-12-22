import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";

import { FC } from "react";
import { RouteComponentProps } from "react-router";
import StudentItem from "../../../components/SearchPage/StudentItem";
import { hideTabBar } from "../../../utils/TabBar";
import useGroupMembers from "../../../hooks/group/useGroupMembers";
import useGroupMemsCount from "../../../hooks/group/useGroupMemsCount";
import { Virtuoso } from 'react-virtuoso';
import useSelfStudentLite from "../../../hooks/student/useSelfStudentLite";

type GroupMembersPageProps = {
  vanity_url: string;
};

const GroupMembers: FC<RouteComponentProps<GroupMembersPageProps>> = ({
  match,
}) => {
  const { student: meStudent } = useSelfStudentLite();
  const { data } = useGroupMembers(match.params.vanity_url, true);

  useIonViewWillEnter(() => {
    hideTabBar();
  });

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonButtons>
              <IonBackButton
                className="ml-[-5px]"
                defaultHref="/community"
                text={""}
              />
            </IonButtons>
            <IonTitle>Group Members ({data?.length})</IonTitle>
          </IonToolbar>
        </IonHeader>
        <Virtuoso
          className="rounded-xl"
          data={data || []}
          style={{ height: "92%" }}
          totalCount={data?.length || 0}
          itemContent={(i, member) => {
            const klasmeyt = member.student;
            return <div className="h-[60px]">
              <StudentItem student={klasmeyt!} key={klasmeyt!.id} me={klasmeyt!.id === meStudent!.id} />
            </div>;
          }}
        />
      </IonContent>
    </IonPage>
  );
};

export default GroupMembers;
