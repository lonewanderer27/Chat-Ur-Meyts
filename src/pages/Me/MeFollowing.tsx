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
import StudentItem from "../../components/SearchPage/StudentItem";
import { FC, useMemo } from "react";
import { RouteComponentProps } from "react-router";
import { Virtuoso } from "react-virtuoso";
import useSelfInfiniteFollowing from "../../hooks/me/useSelfInfiniteFollowing";
import useSelfFollowing from "../../hooks/me/useSelfFollowing";

const MeFollowing: FC<RouteComponentProps> = () => {
  const { count } = useSelfFollowing();
  const { data: following, fetchNextPage, hasNextPage, isFetchingNextPage } = useSelfInfiniteFollowing();
  useIonViewWillEnter(() => {
    hideTabBar();
  });

  const students = useMemo(
    () => following?.pages.flat() ?? [],
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
          components={{
            Footer: () => {
              if (isFetchingNextPage && hasNextPage) return (
                <IonItem lines="none" className="text-center rounded-b-xl">
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

export default MeFollowing;
