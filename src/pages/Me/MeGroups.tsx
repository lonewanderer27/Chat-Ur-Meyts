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
import { hideTabBar } from "../../utils/TabBar";
import GroupItem from "../../components/SearchPage/GroupItem";
import { FC, useMemo } from "react";
import { RouteComponentProps } from "react-router";
import { Virtuoso } from "react-virtuoso";
import useSelfInfiniteGroups from "../../hooks/me/useSelfInfiniteGroups";
import useSelfGroups from "../../hooks/student/useSelfGroups";

const MeGroups: FC<RouteComponentProps> = () => {
  const { count } = useSelfGroups();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSelfInfiniteGroups();
  useIonViewWillEnter(() => {
    hideTabBar();
  });

  const groups = useMemo(
    () => data?.pages.flat() || [],
    [data?.pages.length]
  )

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
            <IonTitle>Your Groups ({count ?? " "})</IonTitle>
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
                <IonItem lines="none" className="text-center">
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

export default MeGroups;
