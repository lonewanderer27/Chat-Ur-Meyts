import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonSpinner,
  IonText,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { FC } from "react";
import { RouteComponentProps } from "react-router";
import AvatarLarge from "../../components/Me/AvatarLarge";
import useGroupInfoLite from "../../hooks/group/useGroupInfoLite";
import useGroupMemsCount from "../../hooks/group/useGroupMemsCount";
import useMePendingRequest from "../../hooks/group/useMePendingRequest";
import dayjs from "dayjs";

type GroupTimelinePageProps = {
  vanity_url: string;
};

const GroupPreview: FC<RouteComponentProps<GroupTimelinePageProps>> = ({
  match,
}) => {
  const { data: infoLite } = useGroupInfoLite(match.params.vanity_url);
  const { data } = useGroupMemsCount(match.params.vanity_url);
  const {
    data: pendingRequest,
    isLoading: PRLoading,
    toggleJoin,
    cancelPendingRequest,
    joining,
  } = useMePendingRequest(match.params.vanity_url, infoLite?.id! + "");

  const rt = useIonRouter();
  const handleMembers = () => {
    rt.push(
      "/group/vu/" +
      match.params.vanity_url +
      "/members",
      "forward",
      "push"
    );
  };

  console.log("pushed by: ", rt.routeInfo.pushedByRoute);

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton
                defaultHref={"/" + rt.routeInfo.pathname.split("/")[1]}
                text=""
              />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <div className="flex justify-center mb-[-80px] z-[500]">
          <AvatarLarge avatarUrl={infoLite?.avatar_url} />
        </div>
        <IonCard className="pt-16 mx-0 z-[-500]">
          <IonCardContent>
            <IonGrid>
              <IonRow className="flex justify-center">
                <IonText color="dark">{infoLite?.name ?? "-"}</IonText>
              </IonRow>
              <IonRow className="flex justify-center mt-2">
                <IonButton
                  shape="round"
                  size="small"
                  className="mx-1"
                  color="light"
                  onClick={handleMembers}
                >
                  {infoLite?.approx_members_count} Members
                </IonButton>
                {PRLoading === false && pendingRequest ? (
                  <IonButton
                    shape="round"
                    size="small"
                    className="mx-1"
                    onClick={cancelPendingRequest}
                  >
                    {joining ? <IonSpinner name="dots" /> : "Cancel Request"}
                  </IonButton>
                ) : (
                  <IonButton
                    shape="round"
                    size="small"
                    className="mx-1"
                    onClick={() => {
                      if (PRLoading) return;
                      toggleJoin();
                    }}
                    disabled={PRLoading || joining}
                  >
                    {PRLoading || joining ? (
                      <IonSpinner name="dots" />
                    ) : (
                      "Join"
                    )}
                  </IonButton>
                )}
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>
        <IonCard className="mt-4 mx-0 rounded-xl">
          <IonCardContent>
            <div>
              <IonText className="text-xs font-bold" color="dark">
                CREATED ON
              </IonText>
              <br />
            </div>
            <div className="">
              <IonText className="text-sm" color="dark">
                {dayjs(infoLite?.created_at).format("MMMM D, YYYY")}
              </IonText>
            </div>
          </IonCardContent>
        </IonCard>
        {infoLite?.description && (
          <IonCard className="mt-4 mx-0 rounded-xl">
            <IonCardContent>
              <div>
                <IonText className="text-xs font-bold" color="dark">
                  DESCRIPTION
                </IonText>
                <br />
              </div>
              <div className="">
                <IonText className="text-sm" color="dark">
                  {infoLite?.description}
                </IonText>
              </div>
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default GroupPreview;
