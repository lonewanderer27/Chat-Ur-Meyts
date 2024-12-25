import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";

import { FC, useMemo } from "react";
import { RouteComponentProps } from "react-router";
import StudentItem from "../../../components/SearchPage/StudentItem";
import { hideTabBar } from "../../../utils/TabBar";
import useGroupMemsCount from "../../../hooks/group/useGroupMemsCount";
import { Virtuoso } from 'react-virtuoso';
import useSelfStudentLite from "../../../hooks/me/useSelfStudentLite";
import useInfiniteGroupMembers from "../../../hooks/group/useInfiniteGroupMembers";

type GroupMembersPageProps = {
  vanity_url: string;
};

const GroupMembers: FC<RouteComponentProps<GroupMembersPageProps>> = ({
  match,
}) => {
  const { student: meStudent } = useSelfStudentLite();
  const { data: count } = useGroupMemsCount(match.params.vanity_url);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteGroupMembers(match.params.vanity_url, true);

  useIonViewWillEnter(() => {
    hideTabBar();
  });

  const members = useMemo(() => data?.pages.flat() || [], [data?.pages.length]);

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
            <IonTitle>Group Members ({count ?? " "})</IonTitle>
          </IonToolbar>
        </IonHeader>
        <Virtuoso
          className="rounded-xl"
          data={members}
          style={{ height: "92%" }}
          totalCount={data?.pages.length || 0}
          itemContent={(i, member) => {
            const klasmeyt = member.student;
            return <div className="h-[60px]">
              <StudentItem
                student={klasmeyt!}
                key={klasmeyt!.id}
                me={klasmeyt!.id === meStudent!.id}
              />
            </div>;
          }}
          components={{
            Footer: () => {
              if (isFetchingNextPage && hasNextPage) return (
                <IonItem lines="none" className="text-center">
                  <IonLabel color="medium">Loading more...</IonLabel>
                </IonItem>
              )
              if (count === members.length) return (
                <IonItem lines="none" className="text-center">
                  <IonLabel color="medium">No more members</IonLabel>
                </IonItem>
              )
            },
          }}
          endReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
        />
      </IonContent>
    </IonPage>
  );
};

export default GroupMembers;
