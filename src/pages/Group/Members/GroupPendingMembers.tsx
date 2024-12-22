import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  useIonRouter,
  useIonViewWillEnter,
} from "@ionic/react";

import { FC } from "react";
import { RouteComponentProps } from "react-router";
import { hideTabBar } from "../../../utils/TabBar";
import useGroupMembers from "../../../hooks/group/useGroupMembers";
import client from "../../../client";
import { personCircleOutline } from "ionicons/icons";
import useSelfStudentLite from "../../../hooks/student/useSelfStudentLite";
import useAmIAMember from "../../../hooks/group/useAmIAMember";
import GroupPreview from "../GroupPreview";

type GroupPendingMembersPageProps = {
  vanity_url: string;
};

const GroupPendingMembers: FC<
  RouteComponentProps<GroupPendingMembersPageProps>
> = (p) => {
  const { data, refetch, group } = useGroupMembers(p.match.params.vanity_url, false);
  const { profile, student } = useSelfStudentLite();

  useIonViewWillEnter(() => {
    hideTabBar();
  });

  const handleApprove = async (event: React.MouseEvent<HTMLIonButtonElement, MouseEvent>, studentId: number, groupId: number) => {
    // prevent bubbling
    event.stopPropagation();

    const res = await client
      .from("group_members")
      .update({
        approved: true,
      })
      .eq("group_id", groupId)
      .eq("student_id", studentId);

    if (res.error) {
      console.error(res.error);
      return;
    }

    // refetch our group members
    refetch();
  };

  const rt = useIonRouter();
  const handleGoToStudent = (studentId: string, me: boolean) => {
    // get the main pathname like /community
    const mainPathname = rt.routeInfo.pathname.split("/")[1];

    // if me is true, then we are this person
    if (me) {
      rt.push("/" + mainPathname + "/me");
      return;
    }

    // otherwise we are looking at someone else
    rt.push("/" + mainPathname + "/student/id/" + studentId);
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const AIM = useAmIAMember(p.match.params.vanity_url);
  if (AIM.isLoading) {
    return <IonLoading isOpen={true} />;
  }

  if (AIM.isLoading === false) {
    if (AIM.data === null || AIM.data?.approved === false) {
      return <GroupPreview {...p} />
    }
  }

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
            <IonTitle>Pending Members ({data?.length ?? "-"})</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList className="mx-[-15px]">
          {data?.map((member) => {
            const cs = member.student;
            // find it if it's me
            const me = cs!.id === student?.id;
            return (
              <IonItem lines="inset" onClick={() => handleGoToStudent(member.student_id + "", me)} className="cursor-pointer" key={member.student_id}>
                {cs!.avatar_url && isValidUrl(cs!.avatar_url) ? (
                  <IonAvatar slot="start" className="mr-3 studentItemLogo">
                    <img className="studentItemLogo" src={cs!.avatar_url} />
                  </IonAvatar>
                ) : (
                  <IonIcon
                    className="studentItemIcon"
                    slot="start"
                    icon={personCircleOutline}
                  ></IonIcon>
                )}
                <IonRow className="ion-align-items-center ml-[-5px]">
                  <IonCol>
                    <IonText className="studentItemName truncate font-poppins">
                      {cs!.full_name}
                    </IonText>
                  </IonCol>
                </IonRow>
                <IonButton slot="end" onClick={(event) => handleApprove(event, cs!.id, group!.id)}>
                  <IonLabel>Approve</IonLabel>
                </IonButton>
              </IonItem>
            );
          })}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default GroupPendingMembers;
