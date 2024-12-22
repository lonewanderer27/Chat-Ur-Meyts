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
import { hideTabBar } from "../../utils/TabBar";

import StudentItem from "../../components/SearchPage/StudentItem";
import { FC, useMemo } from "react";
import { RouteComponentProps } from "react-router";
import { Virtuoso } from "react-virtuoso";
import useSelfInfiniteFollowing from "../../hooks/student/useSelfInfiniteFollowing";
import useSelfFollowingCount from "../../hooks/me/useSelfFollowingCount";

const MeFollowing: FC<RouteComponentProps> = () => {
  const { data: count } = useSelfFollowingCount();
  const { data: following } = useSelfInfiniteFollowing();
  useIonViewWillEnter(() => {
    hideTabBar();
  });

  const students = useMemo(
    () => following?.pages.flat() || [],
    [following?.pages.length]);

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
            <IonTitle>Your Following ({count ?? " "})</IonTitle>
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

export default MeFollowing;
