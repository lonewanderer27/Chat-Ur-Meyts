import "./OldGroupCard.css";

import {
  IonAvatar,
  IonBadge,
  IonCard,
  IonCol,
  IonIcon,
  IonRow,
  IonText,
  useIonRouter,
} from "@ionic/react";
import { peopleCircleOutline, personCircleOutline } from "ionicons/icons";

import { GroupResponse } from "../../services/groups";
import { isValidUrl } from "../../utils/ValidUrl";

export default function OldGroupCard(props: {
  group: GroupResponse["get"]["data"]["group"];
  icon: string;
}) {
  const rt = useIonRouter();
  function handleView() {
    rt.push("/group/vu/"+props.group.vanity_id, "forward")
  }

  return (
    <IonCol size="6" className="flex flex-column w-full cursor-pointer">
      <IonCard
        className="groupCard ion-padding ion-no-margin w-full font-poppins"
        onClick={handleView}
      >
        <IonRow>
          <IonAvatar>
            {props.group.avatar_url && isValidUrl(props.group.avatar_url) ? (
              <img className="groupCardAvatar" src={props.group.avatar_url} />
            ) : (
              <IonIcon className="groupCardIcon" src={props.icon}></IonIcon>
            )}
          </IonAvatar>
        </IonRow>
        <IonRow className="my-2">
          <IonText className="text-ellipsis font-semibold text-lg font-poppins truncate">
            {props.group.name}
          </IonText>
        </IonRow>
        <IonRow>
          {props.group.group_members.length > 4 && (
            <>
              {props.group.group_members.slice(0, 4).map((member, index) => {
                if (member.students.avatar_url) {
                  return (
                    <IonAvatar
                      key={"avatar:" + index}
                      className="groupMemberAvatar"
                    >
                      <img src={member.students.avatar_url} />
                    </IonAvatar>
                  );
                } else {
                  return (
                    <IonIcon
                      key={"ionicon:members:" + index}
                      className="groupMemberIcon"
                      src={personCircleOutline}
                    ></IonIcon>
                  );
                }
              })}
              <IonBadge color="light" className="groupCountBadge">
                <IonText>+{props.group.group_members.length - 4}</IonText>
              </IonBadge>
            </>
          )}
          {props.group.group_members.length <= 4 && (
            <>
              {props.group.group_members.map((member, index) => {
                if (member.students.avatar_url) {
                  return (
                    <IonAvatar
                      key={"avatar:" + index}
                      className="groupMemberAvatar"
                    >
                      <img src={member.students.avatar_url} />
                    </IonAvatar>
                  );
                } else {
                  return (
                    <IonIcon
                      key={"ionicon:members:" + index}
                      className="groupMemberIcon"
                      src={personCircleOutline}
                    ></IonIcon>
                  );
                }
              })}
            </>
          )}
        </IonRow>
      </IonCard>
    </IonCol>
  );
}

OldGroupCard.defaultProps = {
  icon: peopleCircleOutline,
};
