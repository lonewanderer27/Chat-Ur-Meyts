import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonChip,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonLoading,
  IonPage,
  IonRow,
  IonText,
  IonToolbar,
  useIonRouter,
  useIonToast,
  useIonViewWillEnter,
} from "@ionic/react";
import { FC, useState } from "react";
import { RouteComponentProps } from "react-router";
import useGroupMemsCount from "../../hooks/group/useGroupMemsCount";
import useGroupInfoLite from "../../hooks/group/useGroupInfoLite";
import { Share } from '@capacitor/share';
import AvatarLarge from "../../components/Me/AvatarLarge";
import { peopleOutline, shareSocialOutline } from "ionicons/icons";
import useAmIAdmin from "../../hooks/group/useAmIAdmin";
import dayjs from "dayjs";
import useAmIAMember from "../../hooks/group/useAmIAMember";
import GroupPreview from "./GroupPreview";
import useGroupRules from "../../hooks/group/useGroupRules";
import { hideTabBar } from "../../utils/TabBar";
import { Capacitor } from "@capacitor/core";

type GroupInfoPageProps = {
  vanity_url: string;
};

const GroupInfo: FC<RouteComponentProps<GroupInfoPageProps>> = (p) => {
  const { data: infoLite } = useGroupInfoLite(p.match.params.vanity_url);
  console.log(infoLite)
  const { data: AmIAdmin, isLoading: AmIAdminLoading } = useAmIAdmin(p.match.params.vanity_url);
  const { data: groupRules } = useGroupRules(p.match.params.vanity_url);

  const rt = useIonRouter();

  const [toast] = useIonToast();
  const handleShare = async () => {
    const title = infoLite?.name ?? "Group";
    const content = infoLite?.description ?? "Check out this group in Chat-Ur-Meyts App!";

    // for the url, remove the /info part
    // so that the user will be redirected to the group page
    const url = window.location.href.replace("/info", "");

    if ((await Share.canShare()).value) {
      await Share.share({
        title: title,
        text: content,
        url: url,
        dialogTitle: "Share this post",
      });
    } else {
      // share is not available
      // construct a text to copy to clipboard
      // with the title, content, and url
      const text = `${title}\n\n${content}\n\n${url}`;

      // detect if we're on web
      // if we are, then copy to clipboard
      if (!Capacitor.isNativePlatform()) {
        // copy to clipboard
        const clipRes = await navigator.clipboard.writeText(text);

        // alert the user that the text has been copied
        toast({
          message: "Group information has been copied to clipboard",
          duration: 2000,
        })
      }
    }
  };

  const handleMembers = () => {
    rt.push(
      "/" +
      rt.routeInfo.pathname.split("/")[1] +
      "/group/vu/" +
      p.match.params.vanity_url +
      "/members",
      "forward",
      "push"
    );
  };

  const handlePendingMembers = () => {
    rt.push(
      "/" +
      rt.routeInfo.pathname.split("/")[1] +
      "/group/vu/" +
      p.match.params.vanity_url +
      "/members/pending",
      "forward",
      "push"
    );
  };

  const AIM = useAmIAMember(p.match.params.vanity_url);
  if (AIM.isLoading) {
    return <IonLoading isOpen={true} />;
  }

  if (AIM.isLoading === false) {
    if (AIM.data === null || AIM.data?.approved === false) {
      return <GroupPreview {...p} />;
    }
  }

  const [showAllRules, setShowAllRules] = useState(false);
  const displayedRules = groupRules ? (showAllRules ? groupRules : groupRules.slice(0, 3)) : [];

  useIonViewWillEnter(() => {
    hideTabBar();
  });

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton
                defaultHref={"/" + rt.routeInfo.pushedByRoute}
                text=""
              />
            </IonButtons>
            <IonButtons slot="end">
              <IonButton onClick={handleShare}>
                <IonIcon icon={shareSocialOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <div className="flex justify-center mb-[-80px] z-[500]">
          <AvatarLarge avatarUrl={infoLite?.avatar_url} />
        </div>
        <IonCard className="pt-16 mx-0 z-[-500] ">
          <IonCardContent>
            <IonGrid>
              <IonRow className="flex justify-center">
                <IonText color="dark">{infoLite?.name ?? "-"}</IonText>
              </IonRow>
              <IonRow className="pt-[10px] flex justify-center">
                <IonChip onClick={handleMembers}>
                  <IonIcon icon={peopleOutline} />
                  <IonLabel>{infoLite?.approx_members_count} Members</IonLabel>
                </IonChip>
                {AmIAdminLoading === false && AmIAdmin ? (
                  <IonChip onClick={handlePendingMembers}>
                    <IonIcon icon={peopleOutline} />
                    <IonLabel>Pending</IonLabel>
                  </IonChip>
                ) : null}
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>
        <IonList className="rounded-xl px-1 mt-4" lines="none">
          <IonListHeader>
            <IonLabel className="uppercase text-xs">CREATED ON</IonLabel>
          </IonListHeader>
          <IonItem>
            <IonText className="text-sm">
              {dayjs(infoLite?.created_at).format("MMMM D, YYYY")}
            </IonText>
          </IonItem>
        </IonList>
        <IonList className="rounded-xl px-1 mt-4 ion-padding-bottom" lines="none">
          <IonListHeader>
            <IonLabel className="uppercase text-xs">DESCRIPTION</IonLabel>
          </IonListHeader>
          <IonItem>
            <IonLabel>
              <h3>{infoLite?.description}</h3>
            </IonLabel>
          </IonItem>
        </IonList>
        {groupRules && groupRules.length > 0 && (
          <IonList className="rounded-xl px-1 mt-4" color="light">
            <IonListHeader>
              <IonLabel className="uppercase text-xs">RULES</IonLabel>
              {groupRules && groupRules.length > 3 && (
                <IonButton size="small" onClick={() => setShowAllRules(!showAllRules)}>
                  {showAllRules ? "Show Less" : "See All"}
                </IonButton>
              )}
            </IonListHeader>
            {displayedRules.map((rule, i) => (
              <IonItem key={i}>
                <IonLabel>
                  <h3>{rule.title}</h3>
                  <p>{rule.description}</p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default GroupInfo;