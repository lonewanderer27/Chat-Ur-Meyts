import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonChip,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonRow,
  IonText,
  IonToolbar,
  useIonRouter,
  useIonViewWillEnter,
  createAnimation,
  useIonAlert, // Import createAnimation
} from "@ionic/react";

import { FC, useEffect, useRef } from "react";
import AvatarLarge from "../components/Me/AvatarLarge";
import { RouteComponentProps } from "react-router";
import useSelfStudentLite from "../hooks/student/useSelfStudentLite";
import useSession from "../hooks/auth/useSession";
import { add, addCircleOutline, addOutline, colorWandOutline, pencilOutline, pencilSharp } from "ionicons/icons";
import useSelfGroups from "../hooks/student/useSelfGroups";
import useSelfFollowing from "../hooks/student/useSelfFollowing";
import useSelfHobbies from "../hooks/student/useSelfHobbies";
import useSelfSubjects from "../hooks/student/useSelfSubjects";
import string from "string";
import MeLoaderCard from "../components/Me/MeLoaderCard";
import { hideTabBar } from "../utils/TabBar";

const Me: FC<RouteComponentProps> = () => {
  useIonViewWillEnter(() => {
    hideTabBar();
  });

  const rt = useIonRouter();
  const { student, query: studentQuery } = useSelfStudentLite();
  const { hobbies, query: hobbiesQuery } = useSelfHobbies();
  const { subjects, query: subjectsQuery } = useSelfSubjects();

  const [alert, dismiss] = useIonAlert();
  const { logout } = useSession();
  const handleLogout = () => {
    // confirm if the user wants to logout
    alert({
      header: "Logout",
      message: "Are you sure you want to logout?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: dismiss
        },
        {
          text: "Confirm",
          role: "destructive",
          handler: logout
        },
      ],
    });
  }

  const { data: groups } = useSelfGroups();
  const { data: following } = useSelfFollowing();

  const handleFollowing = () => {
    rt.push(rt.routeInfo.pathname + "/following");
  };

  const handleGroups = () => {
    rt.push(rt.routeInfo.pathname + "/groups");
  };

  const handleUpdate = () => {
    rt.push(rt.routeInfo.pathname + "/update");
  };

  const handleRecommendation = () => {
    rt.push(rt.routeInfo.pathname + "/recommend/groups");
  };

  // Create refs for each section and loader
  const descriptionRef = useRef<HTMLDivElement>(null);
  const subjectsRef = useRef<HTMLDivElement>(null);
  const hobbiesRef = useRef<HTMLDivElement>(null);

  const descriptionLoaderRef = useRef<HTMLDivElement>(null);
  const subjectsLoaderRef = useRef<HTMLDivElement>(null);
  const hobbiesLoaderRef = useRef<HTMLDivElement>(null);

  // Animate description when data is loaded
  useEffect(() => {
    if (student?.description && descriptionRef.current) {
      const animation = createAnimation()
        .addElement(descriptionRef.current)
        .duration(500)
        .easing('ease-in-out')
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'translateY(20px)', 'translateY(0px)');
      animation.play();
    }
  }, [student?.description]);

  // Animate subjects when data is loaded
  useEffect(() => {
    if (subjects.length > 0 && subjectsRef.current) {
      const animation = createAnimation()
        .addElement(subjectsRef.current)
        .duration(500)
        .easing('ease-in-out')
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'translateY(20px)', 'translateY(0px)');
      animation.play();
    }
  }, [subjects]);

  // Animate hobbies when data is loaded
  useEffect(() => {
    if (hobbies.length > 0 && hobbiesRef.current) {
      const animation = createAnimation()
        .addElement(hobbiesRef.current)
        .duration(500)
        .easing('ease-in-out')
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'translateY(20px)', 'translateY(0px)');
      animation.play();
    }
  }, [hobbies]);

  // Animate description loader when loading starts
  useEffect(() => {
    if ((studentQuery.isLoading || student == null) && descriptionLoaderRef.current) {
      const animation = createAnimation()
        .addElement(descriptionLoaderRef.current)
        .duration(500)
        .easing('ease-in-out')
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'translateY(-20px)', 'translateY(0px)');
      animation.play();
    }
  }, [studentQuery.isLoading, student]);

  // Animate subjects loader when loading starts
  useEffect(() => {
    if ((subjectsQuery.isLoading || subjects == null) && subjectsLoaderRef.current) {
      const animation = createAnimation()
        .addElement(subjectsLoaderRef.current)
        .duration(500)
        .easing('ease-in-out')
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'translateY(-20px)', 'translateY(0px)');
      animation.play();
    }
  }, [subjectsQuery.isLoading, subjects]);

  // Animate hobbies loader when loading starts
  useEffect(() => {
    if ((hobbiesQuery.isLoading || hobbies == null) && hobbiesLoaderRef.current) {
      const animation = createAnimation()
        .addElement(hobbiesLoaderRef.current)
        .duration(500)
        .easing('ease-in-out')
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'translateY(-20px)', 'translateY(0px)');
      animation.play();
    }
  }, [hobbiesQuery.isLoading, hobbies]);

  const handleUpdateHobbies = () => {
    rt.push(rt.routeInfo.pathname + "/update/hobbies");
  }

  return (
    <IonPage id="MePage">
      <IonContent className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/community" text={""} />
            </IonButtons>
            <IonButtons slot="end">
              <IonButton fill="clear" onClick={handleRecommendation}>
                <IonIcon slot="start" src={colorWandOutline} />
              </IonButton>
              <IonButton fill="clear" onClick={handleUpdate}>
                <IonLabel>Edit</IonLabel>
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <div className="flex justify-center mb-[-80px] z-[500]">
          <AvatarLarge avatarUrl={student?.avatar_url} />
        </div>
        <IonCard className="pt-16 mx-0  z-[-500] ">
          <IonCardContent>
            <IonGrid>
              <IonRow className="flex justify-end mt-[-70px] pb-4 top-0 ">
                <IonButton size="small" className="invisible">
                  Edit
                </IonButton>
              </IonRow>
              <IonRow className="flex justify-center">
                <IonText color="dark">{student?.full_name ?? "-"}</IonText>
              </IonRow>
              <IonRow className="flex justify-center mt-1">
                <IonText className="text-sm capitalize" color="dark">
                  {student?.block ? student.block : "-"}
                </IonText>
              </IonRow>
              <IonRow className="text-center mt-2">
                <IonCol className="cursor-pointer" onClick={handleFollowing}>
                  <IonText className="text-2xl" color="dark">
                    {following?.length ?? "-"}
                  </IonText>
                  <br />
                  <IonText className="text-sm" color="dark">
                    following
                  </IonText>
                </IonCol>
                <IonCol className="cursor-pointer" onClick={handleGroups}>
                  <IonText className="text-2xl" color="dark">
                    {groups?.length ?? "-"}
                  </IonText>
                  <br />
                  <IonText className="text-sm" color="dark">
                    groups
                  </IonText>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {/* Description Section with Animation */}
        {(student?.description && studentQuery.isLoading == false) && (
          <div ref={descriptionRef}>
            <IonCard className="mt-4 mx-0 rounded-xl ">
              <IonCardContent>
                <div>
                  <IonText className="text-xs font-bold" color="dark">
                    BIO
                  </IonText>
                  <br />
                </div>
                <div className="">
                  <IonText className="text-sm" color="dark">
                    {student?.description}
                  </IonText>
                </div>
              </IonCardContent>
            </IonCard>
          </div>
        )}
        {/* Description Loader with Animation */}
        {(studentQuery.isLoading === true || student === null) && (
          <div ref={descriptionLoaderRef}>
            <MeLoaderCard showParagraph hideChips />
          </div>
        )}

        {/* Subjects Section with Animation */}
        {subjects.length > 0 && (
          <div ref={subjectsRef}>
            <IonCard className="mt-4 mx-0 rounded-xl ">
              <IonCardContent>
                <div className="mb-2">
                  <IonText className="text-xs font-bold" color="dark">
                    SUBJECTS
                  </IonText>
                  <br />
                </div>
                <div className="mx-[-5px]">
                  {subjects.map((subject) => (
                    <IonChip key={subject.id + subject.title} color="dark">
                      <IonText>
                        {string(subject.title.toLowerCase()).titleCase().s}
                      </IonText>
                    </IonChip>
                  ))}
                </div>
              </IonCardContent>
            </IonCard>
          </div>
        )}
        {/* Subjects Loader with Animation */}
        {(subjectsQuery.isLoading || subjects === null) && (
          <div ref={subjectsLoaderRef}>
            <MeLoaderCard />
          </div>
        )}

        {/* Hobbies Section with Animation */}
        {(!hobbiesQuery.isLoading && hobbies.length > 0) && (
          <div ref={hobbiesRef}>
            <IonCard className="mt-4 mx-0 rounded-xl ">
              <IonCardContent>
                <div className="mb-2 flex justify-between">
                  <IonText className="text-xs font-bold" color="dark">
                    INTERESTS
                  </IonText>
                  <br />
                </div>
                <div className="mx-[-5px]">
                  {hobbies.map((hobby) => (
                    <IonChip key={hobby.id + hobby.title} color="dark">
                      <IonText>{hobby.title}</IonText>
                    </IonChip>
                  ))}
                  <IonChip onClick={handleUpdateHobbies}>
                    <IonIcon icon={addCircleOutline} />
                    <IonText>Add Interests</IonText>
                  </IonChip>
                </div>
              </IonCardContent>
            </IonCard>
          </div>
        )}
        {/* Hobbies Loader with Animation */}
        {(hobbiesQuery.isLoading || hobbies == null) && (
          <div ref={hobbiesLoaderRef}>
            <MeLoaderCard />
          </div>
        )}
        <IonButton color="danger" expand="block" onClick={handleLogout}>
          <IonLabel>Logout</IonLabel>
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Me;
