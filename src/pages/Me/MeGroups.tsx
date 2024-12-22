import {
  IonBackButton,
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

import GroupItem from "../../components/SearchPage/GroupItem";
import useSelfStudent from "../../hooks/student";
import { FC } from "react";
import { RouteComponentProps } from "react-router";
import useStudentGroups from "../../hooks/student/useStudentGroups";
import { Virtuoso } from "react-virtuoso";

const MeGroups: FC<RouteComponentProps> = ({ match }) => {
  const { groups } = useSelfStudent();

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
            <IonTitle>Your Groups ({groups?.length ?? "-"})</IonTitle>
          </IonToolbar>
        </IonHeader>
        <Virtuoso
          className="rounded-xl"
          data={groups || []}
          style={{ height: "92%" }}
          totalCount={groups?.length || 0}
          itemContent={(i, group) => (
            <GroupItem
              group={group}
              key={group.id}
            />
          )}
        />
      </IonContent>
    </IonPage>
  );
};

export default MeGroups;
