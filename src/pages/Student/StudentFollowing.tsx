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
import StudentItem from "../../components/SearchPage/StudentItem";
import { hideTabBar } from "../../utils/TabBar";
import useStudentFollowingCount from "../../hooks/student/useStudentFollowingCount";
import useStudentInfiniteFollowing from "../../hooks/student/useStudentInfiniteFollowing";
import { Virtuoso } from "react-virtuoso";
import useStudentFollowings from "../../hooks/student/useStudentFollowings";

type StudentFollowingPageProps = {
  student_id: string;
};

const StudentFollowing: FC<RouteComponentProps<StudentFollowingPageProps>> = ({
  match,
}) => {
  const { count } = useStudentFollowings(match.params.student_id);
  const { data: following, fetchNextPage, hasNextPage, isFetchingNextPage } = useStudentInfiniteFollowing(match.params.student_id);
  useIonViewWillEnter(() => {
    hideTabBar();
  });

  const students = useMemo(
    () => following?.pages.flat() ?? [],
    [following?.pages.length,]);

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
            <IonTitle>Following ({ count ?? " " })</IonTitle>
          </IonToolbar>
        </IonHeader>
        <Virtuoso
          className="rounded-xl"
          data={students}
          style={{ height: "92%" }}
          totalCount={students?.length || 0}
          itemContent={(i, student) => (
            <StudentItem
              key={i}
              student={student}
            />
          )}
          components={{
            Footer: () => {
              if (isFetchingNextPage && hasNextPage) return (
                <IonItem lines="none" className="text-center">
                  <IonLabel color="medium">Loading more...</IonLabel>
                </IonItem>
              )
              if (count === students.length) return (
                <IonItem lines="none" className="text-center rounded-b-xl">
                  <IonLabel color="medium">No more students</IonLabel>
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

export default StudentFollowing;
