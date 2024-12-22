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

import { FC, useMemo } from "react";
import { RouteComponentProps } from "react-router";
import StudentItem from "../../components/SearchPage/StudentItem";
import { hideTabBar } from "../../utils/TabBar";
import useStudentFollowingCount from "../../hooks/student/useStudentFollowingCount";
import useInfiniteStudentFollowing from "../../hooks/student/useInfiniteStudentFollowing";
import { Virtuoso } from "react-virtuoso";

type StudentFollowingPageProps = {
  student_id: string;
};

const StudentFollowing: FC<RouteComponentProps<StudentFollowingPageProps>> = ({
  match,
}) => {
  const { data: count } = useStudentFollowingCount(match.params.student_id);
  const { data: following } = useInfiniteStudentFollowing(match.params.student_id);
  useIonViewWillEnter(() => {
    hideTabBar();
  });

  const students = useMemo(
    () => following?.pages.flat() || [],
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
            <IonTitle>Their Following ({count ?? "-"})</IonTitle>
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
              student={student!}
            />
          )}
        />
      </IonContent>
    </IonPage>
  );
};

export default StudentFollowing;
