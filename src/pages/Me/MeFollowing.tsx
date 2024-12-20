import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonList,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import { hideTabBar } from "../../utils/TabBar";

import StudentItem from "../../components/SearchPage/StudentItem";
import useSelfStudent from "../../hooks/student";
import { FC } from "react";
import { RouteComponentProps } from "react-router";
import { Virtuoso } from "react-virtuoso";

const MeFollowing: FC<RouteComponentProps> = () => {
  const { following } = useSelfStudent();
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
            <IonTitle>Your Following ({following?.length ?? "-"})</IonTitle>
          </IonToolbar>
        </IonHeader>
        <Virtuoso
          className="rounded-xl"
          data={following || []}
          style={{ height: "92%" }}
          totalCount={following?.length || 0}
          itemContent={(i, student) => (
            <StudentItem
              student={student}
              key={student.id}
            />
          )}
        />
      </IonContent>
    </IonPage>
  );
};

export default MeFollowing;
