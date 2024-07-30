import {
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonText,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import { notificationsOutline, searchOutline } from "ionicons/icons";

import AdminPostsGrid from "../components/DiscoverPage/AdminPostsGrid";
import NavBtn from "../components/NavBtn";
import { getAdminPosts } from "../services/group/admin";
import { getAllGroups } from "../services/groups";
import { showTabBar } from "../utils/TabBar";
import { useQuery } from "@tanstack/react-query";
import useSelfStudent from "../hooks/student";
import ExploreGroupsGrid from "../components/DiscoverPage/ExploreGroupsGrid";
import { FC } from "react";
import { RouteComponentProps } from "react-router";

const Discover: FC<RouteComponentProps> = ({ match }) => {
  const { student } = useSelfStudent();

  const iaQuery = useQuery({
    queryKey: ["important_announcements"],
    queryFn: async () => {
      const res = await getAdminPosts(student!.school + "");
      console.log("adminPosts", res);
      return res;
    },
    enabled: !!student?.id,
  });

  useIonViewWillEnter(() => {
    showTabBar();
  });

  return (
    <IonPage id="discover-page">
      <IonContent className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonText
              slot="start"
              className="page-title font-poppins font-bold"
              color="secondary"
            >
              Chat-Ur-Meyts
            </IonText>
            <IonButtons slot="end">
              <NavBtn route="/discover/me" avatarUrl={student?.avatar_url} />
              <NavBtn route="/discover/search" icon={searchOutline} />
              <NavBtn route="/discover/inbox" icon={notificationsOutline} />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <AdminPostsGrid
          group={iaQuery.data?.group}
          posts={iaQuery.data?.group_posts}
        />
        <ExploreGroupsGrid />
      </IonContent>
    </IonPage>
  );
};

export default Discover;
