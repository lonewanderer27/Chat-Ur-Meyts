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
import GroupItem from "../../components/SearchPage/GroupItem";
import { RouteComponentProps } from "react-router";
import { hideTabBar } from "../../utils/TabBar";
import useStudentInfiniteGroups from "../../hooks/student/useStudentInfiniteGroups";
import { Virtuoso } from "react-virtuoso";
import useStudentGroups2 from "../../hooks/student/useStudentGroups2";

type StudentGroupsPageProps = {
  student_id: string;
};

const StudentGroups: FC<RouteComponentProps<StudentGroupsPageProps>> = ({
  match,
}) => {
  const { count } = useStudentGroups2(match.params.student_id);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useStudentInfiniteGroups(match.params.student_id);
  useIonViewWillEnter(() => {
    hideTabBar();
  });

  const groups = useMemo(
    () => data?.pages.flat() ?? [],
    [data?.pages.length]);

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonButtons>
              <IonBackButton
                className="ml-[-5px]"
                defaultHref="/discover"
                text={""}
              />
            </IonButtons>
            <IonTitle>Groups ({groups.length ?? " "})</IonTitle>
          </IonToolbar>
        </IonHeader>
        <Virtuoso
          className="rounded-xl"
          data={groups ?? []}
          style={{ height: "92%" }}
          totalCount={groups.length || 0}
          itemContent={(i, group) => (
            <GroupItem
              key={i}
              group={group}
            />
          )}
          components={{
            Footer: () => {
              if (isFetchingNextPage && hasNextPage) return (
                <IonItem lines="none" className="text-center rounded-b-xl">
                  <IonLabel color="medium">Loading more...</IonLabel>
                </IonItem>
              )
              if (count === groups.length) return (
                <IonItem lines="none" className="text-center rounded-b-xl">
                  <IonLabel color="medium">No more groups</IonLabel>
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

export default StudentGroups;
