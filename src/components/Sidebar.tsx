import {
  IonAvatar,
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonSpinner,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";

import client from "../client";
import useSession from "../hooks/auth/useSession";
import useMeAdminGroups from "../hooks/group/useMeAdminGroups";
import { useMemo } from "react";
import { isValidUrl } from "../utils/ValidUrl";
import {
  chatboxOutline,
  compassOutline,
  peopleCircleOutline,
} from "ionicons/icons";
import useMeGroups from "../hooks/group/useMeGroups";

export default function Sidebar() {
  const rt = useIonRouter();
  const { session, logout, processing } = useSession();

  const handleLogout = async () => {
    await logout();
  };

  const handleLogin = async () => {
    rt.push("/continue", "root");
  };

  const handleDiscover = () => {
    rt.push("/discover");
  };

  const handleThreads = () => {
    rt.push("/threads");
  };

  const handleGroup = (vanityUrl: string) => {
    rt.push("/group/vu/" + vanityUrl);
  };

  const { data: meGroups } = useMeGroups();

  return (
    <IonMenu contentId="community-page" type="reveal">
      <IonContent>
        <IonList lines="none">
          <IonListHeader>
            <IonLabel>Shortcuts</IonLabel>
          </IonListHeader>
          <IonItem onClick={handleDiscover}>
            <IonIcon slot="start" icon={compassOutline} />
            <IonLabel>Discover</IonLabel>
          </IonItem>
          <IonItem onClick={handleThreads}>
            <IonIcon slot="start" icon={chatboxOutline} />
            <IonLabel>Threads</IonLabel>
          </IonItem>
        </IonList>
        <IonList lines="none">
          <IonListHeader>
            <IonLabel>Your Groups</IonLabel>
          </IonListHeader>
          {meGroups?.map((group) => {
            if (group!.avatar_url && isValidUrl(group!.avatar_url)) {
              return (
                <IonItem key={group!.id} onClick={() => handleGroup(group!.vanity_id)}>
                  <IonAvatar slot="start">
                    <img
                      src={group!.avatar_url!}
                      className="rounded-full w-16"
                    />
                  </IonAvatar>
                  <IonLabel>{group!.name}</IonLabel>
                </IonItem>
              );
            } else {
              return (
                <IonItem key={group!.id} onClick={() => handleGroup(group!.vanity_id)}>
                  <IonIcon
                    slot="start"
                    icon={peopleCircleOutline}
                    className="text-5xl m-0 ml-[-3px]"
                  />
                  <IonLabel className="ml-2">{group!.name}</IonLabel>
                </IonItem>
              );
            }
          })}
        </IonList>
      </IonContent>
      <IonFooter>
        <IonToolbar className="p-2">
          {session ? (
            <IonButton color="danger" expand="block" onClick={handleLogout}>
              {processing ? <IonSpinner name="dots" /> : "Logout"}
            </IonButton>
          ) : (
            <IonButton expand="block" onClick={handleLogin}>
              Login
            </IonButton>
          )}
        </IonToolbar>
      </IonFooter>
    </IonMenu>
  );
}
