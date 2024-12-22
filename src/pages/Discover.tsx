import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonModal,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonText,
  IonTitle,
  IonToolbar,
  RefresherEventDetail,
  useIonRouter,
  useIonViewWillEnter,
} from "@ionic/react";
import {
  notificationsOutline,
  personCircleOutline,
  searchOutline,
} from "ionicons/icons";

import NavBtn from "../components/NavBtn";
import { showTabBar } from "../utils/TabBar";
import { FC, useRef, useState } from "react";
import { RouteComponentProps } from "react-router";
import useSelfDraftStudent from "../hooks/student/useSelfDraftStudent";
import useSelfRecommendedGroups from "../hooks/student/useSelfRecommendedGroups";
import RecommendedGroupsGrid from "../components/DiscoverPage/RecommendedGroupsGrid";
import useUniversityAnnouncements from "../hooks/group/useUniversityAnnouncements";
import UniversityPostsGrid from "../components/DiscoverPage/UniversityPostsGrid";
import useSelfStudentLite from "../hooks/student/useSelfStudentLite";

const Discover: FC<RouteComponentProps> = ({ match }) => {
  const { student } = useSelfStudentLite();
  const sRGQuery = useSelfRecommendedGroups();
  const uAQuery = useUniversityAnnouncements();

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    const promises = [sRGQuery.query.refetch(), uAQuery.query.refetch()];
    await Promise.all(promises);
    event.detail.complete();
  };

  useIonViewWillEnter(() => {
    showTabBar();
  });

  const [showModal, setShowModal] = useState(false);
  const setupModal = useRef<HTMLIonModalElement>(null);
  const draftStudentRQ = useSelfDraftStudent();
  // console.log("draftStudentRQ", draftStudentRQ.data);

  if (draftStudentRQ.data === null &&
    !showModal &&
    !draftStudentRQ.isLoading) {
    // console.log("no student info found");
    setShowModal(true);
    // console.log("open setup modal");
  } else if (draftStudentRQ.data !== null &&
    !showModal &&
    !draftStudentRQ.isLoading &&
    draftStudentRQ.data?.completed === false
  ) {
    // console.log("incomplete student info found: ", draftStudentRQ.data)
    setShowModal(true)
  } else {
    // console.log("student info found: ", draftStudentRQ.data);
  }

  const rt = useIonRouter();
  const handleSetup = () => {
    // if there is an incomplete draft student
    // then include the session id 
    if (draftStudentRQ.data !== null &&
      showModal === false &&
      draftStudentRQ.isLoading === false &&
      draftStudentRQ.data?.completed === false
    ) {
      const sessionId = draftStudentRQ.data.id;
      rt.push(`/setup?sessionId=${sessionId}`, "forward", "replace")
      return;
    } else {
      // else just forward the user to the regular setup page
      rt.push("/setup", "forward", "replace")
    }
  }

  return (
    <IonPage id="discover-page">
      <IonModal
        ref={setupModal}
        isOpen={showModal}
        initialBreakpoint={0.3}
        breakpoints={[0.3]}
        canDismiss={false}
        backdropDismiss={false}
        handle={false}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>
              Setup Required
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className='ion-padding text-center'>
          Looks like you haven't completed the setup process yet. A complete student profile is mandatory to access all features.
          <IonButton expand="block" className="mt-5" onClick={handleSetup}>
            Tap here to begin!
          </IonButton>
        </IonContent>
      </IonModal>
      <IonContent className="ion-padding" fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent
            refreshingSpinner="dots"
            pullingText={"Pull to refresh"}
          />
        </IonRefresher>
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
              <NavBtn
                route="/me"
                avatarUrl={student?.avatar_url}
                icon={personCircleOutline}
              />
              {/* <NavBtn
                id="open-profile"
                avatarUrl={student?.avatar_url}
                icon={personCircleOutline}
              /> */}
              <NavBtn route="/discover/search" icon={searchOutline} />
              <NavBtn route="/discover/inbox" icon={notificationsOutline} />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        {/* <MeModal /> */}
        <UniversityPostsGrid />
        <RecommendedGroupsGrid />
      </IonContent>
    </IonPage>
  );
};

export default Discover;
