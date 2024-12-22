import {
  createAnimation,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonSpinner,
  IonText,
  IonToolbar,
  useIonRouter,
  useIonViewDidEnter,
  useIonViewWillEnter,
} from "@ionic/react";

import { FC, useEffect, useRef } from "react";
import AvatarLarge from "../../components/Me/AvatarLarge";
import { RouteComponentProps } from "react-router";
import { hideTabBar } from "../../utils/TabBar";
import useStudentFollowings from "../../hooks/student/useStudentFollowings";
import useStudentInfo from "../../hooks/student/useStudentInfo";
import useStudentGroups from "../../hooks/student/useStudentGroups";
import useFollow from "../../hooks/student/useFollow";
import MeLoaderCard from "../../components/Me/MeLoaderCard";
import useStudentHobbies from "../../hooks/student/useStudentHobbies";
import useStudentSubjects from "../../hooks/student/useStudentSubjects";

type StudentPageProps = {
  student_id: string;
};

const StudentPage: FC<RouteComponentProps<StudentPageProps>> = ({ match }) => {
  useIonViewWillEnter(() => {
    hideTabBar();
  });

  const rt = useIonRouter();
  const groupsQry = useStudentGroups(match.params.student_id);
  const studentQry = useStudentInfo(match.params.student_id);
  const followingsQry = useStudentFollowings(match.params.student_id);
  const hobbiesQry = useStudentHobbies(match.params.student_id);
  const subjectsQry = useStudentSubjects(match.params.student_id);

  const {
    data: follow,
    isLoading,
    requesToFollow,
    unfollow,
    loading,
  } = useFollow(match.params.student_id);

  const handleFollowing = () => {
    rt.push(rt.routeInfo.pathname + "/following");
  };

  const handleGroups = () => {
    rt.push(rt.routeInfo.pathname + "/groups");
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
    if (studentQry.data?.description && descriptionRef.current) {
      const animation = createAnimation()
        .addElement(descriptionRef.current)
        .duration(500)
        .easing('ease-in-out')
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'translateY(20px)', 'translateY(0px)');
      animation.play();
    }
  }, [studentQry.data?.description]);

  // Animate subjects when data is loaded
  useEffect(() => {
    if (subjectsQry.data && subjectsQry.data.length > 0 && subjectsRef.current) {
      const animation = createAnimation()
        .addElement(subjectsRef.current)
        .duration(500)
        .easing('ease-in-out')
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'translateY(20px)', 'translateY(0px)');
      animation.play();
    }
  }, [subjectsQry.data]);

  // Animate hobbies when data is loaded
  useEffect(() => {
    if (hobbiesQry.hobbies.length > 0 && hobbiesRef.current) {
      const animation = createAnimation()
        .addElement(hobbiesRef.current)
        .duration(500)
        .easing('ease-in-out')
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'translateY(20px)', 'translateY(0px)');
      animation.play();
    }
  }, [hobbiesQry.hobbies]);

  // Animate description loader when loading starts
  useEffect(() => {
    if ((studentQry.isLoading || studentQry.data == null) && descriptionLoaderRef.current) {
      const animation = createAnimation()
        .addElement(descriptionLoaderRef.current)
        .duration(500)
        .easing('ease-in-out')
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'translateY(-20px)', 'translateY(0px)');
      animation.play();
    }
  }, [studentQry.isLoading, studentQry.data]);

  // Animate subjects loader when loading starts
  useEffect(() => {
    if ((subjectsQry.isLoading || subjectsQry.data == null) && subjectsLoaderRef.current) {
      const animation = createAnimation()
        .addElement(subjectsLoaderRef.current)
        .duration(500)
        .easing('ease-in-out')
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'translateY(-20px)', 'translateY(0px)');
      animation.play();
    }
  }, [subjectsQry.isLoading, subjectsQry.data]);

  // Animate hobbies loader when loading starts
  useEffect(() => {
    if ((hobbiesQry.query.isLoading || hobbiesQry.hobbies == null) && hobbiesLoaderRef.current) {
      const animation = createAnimation()
        .addElement(hobbiesLoaderRef.current)
        .duration(500)
        .easing('ease-in-out')
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'translateY(-20px)', 'translateY(0px)');
      animation.play();
    }
  }, [hobbiesQry.query.isLoading, hobbiesQry.hobbies]);

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
          </IonToolbar>
        </IonHeader>
        <div className="flex justify-center mb-[-80px] z-[500]">
          <AvatarLarge avatarUrl={studentQry.data?.avatar_url} />
        </div>
        <IonCard className="pt-16 rounded-xl  z-[-500]  mx-0">
          <IonCardContent>
            <IonGrid>
              <IonRow className="flex justify-center">
                <IonText color="dark">{studentQry.data?.full_name ?? "-"}</IonText>
              </IonRow>
              <IonRow className="flex justify-center mt-1">
                <IonText className="text-sm capitalize" color="dark">
                  {studentQry.data?.block ? studentQry.data.block : "-"}
                </IonText>
              </IonRow>
              <IonRow className="flex justify-center mt-2">
                <IonButton
                  shape="round"
                  size="small"
                  className="mx-1"
                  color="light"
                >
                  Direct Message
                </IonButton>
                {
                  <IonButton
                    shape="round"
                    size="small"
                    className="mx-1"
                    onClick={() => {
                      if (isLoading) return;
                      if (follow) {
                        unfollow();
                      } else {
                        requesToFollow();
                      }
                    }}
                  >
                    {loading || isLoading ? (
                      <IonSpinner name="dots" />
                    ) : follow ? (
                      <IonText color="light">Unfollow</IonText>
                    ) : (
                      <IonText color="light">Follow</IonText>
                    )}
                  </IonButton>
                }
              </IonRow>
              <IonRow className="text-center mt-2">
                <IonCol className="cursor-pointer" onClick={handleFollowing}>
                  <IonText className="text-2xl" color="dark">
                    {followingsQry.data?.length ?? "-"}
                  </IonText>
                  <br />
                  <IonText className="text-sm" color="dark">
                    following
                  </IonText>
                </IonCol>
                <IonCol className="cursor-pointer" onClick={handleGroups}>
                  <IonText className="text-2xl" color="dark">
                    {groupsQry.data?.length ?? "-"}
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
        {(studentQry.data?.description && studentQry.isFetching == false) && (
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
                    {studentQry.data?.description}
                  </IonText>
                </div>
              </IonCardContent>
            </IonCard>
          </div>
        )}
        {/* Description Loader with Animation */}
        {(studentQry.isFetching === true || studentQry.data === null) && (
          <div ref={descriptionLoaderRef}>
            <MeLoaderCard showParagraph hideChips />
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default StudentPage;
