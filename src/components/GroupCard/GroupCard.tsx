import "./GroupCard.css";
import {
  IonAvatar,
  IonBadge,
  IonCard,
  IonCol,
  IonIcon,
  IonImg,
  IonRow,
  IonText,
  useIonRouter,
} from "@ionic/react";
import { peopleCircleOutline, personCircle, personCircleOutline } from "ionicons/icons";
import { isValidUrl } from "../../utils/ValidUrl";
import { GroupMemberType, GroupType, StudentType } from "../../types";
import useAmIAMember from "../../hooks/group/useAmIAMember";
import { useEffect, useMemo, useState } from "react";
import { getRandomColor } from "./ColorPalette";
import { useToggleTheme } from "../../hooks/useToggleTheme";

interface GT extends GroupType {
  group_members: GroupMemberType[];
}

interface GroupCardProps {
  group: GT;
  icon: string;
}

export default function GroupCard(props: GroupCardProps) {
  const rt = useIonRouter();
  const handleView = () => {
    rt.push(
      "/group/vu/" +
      props.group.vanity_id,
      "none",
      "push"
    );
  };

  // Memoize approved members to avoid recalculating if group members don't change
  const approvedMembers = useMemo(
    () => props.group.group_members.filter((m) => m.approved === true),
    [props.group.group_members]
  );

  // Generate and memoize random colors for each member without an avatar
  const memberColors = useMemo(() => {
    return approvedMembers.map(() => getRandomColor());
  }, [approvedMembers]);

  // get the current dark or light mode
  const [darkMode] = useToggleTheme('darkModeActivated', 'ion-palette-dark');

  return (
    <IonCol size="6" className="flex flex-column w-full cursor-pointer">
      <IonCard
        className="groupCard ion-padding ion-no-margin w-full font-poppins"
        onClick={handleView}
      >
        <IonRow>
          {isValidUrl(props.group.avatar_url + "") && <IonAvatar>
            <img className="groupCardAvatar object-cover rounded-full aspect-square" src={props.group.avatar_url!} />
          </IonAvatar>}
          {!isValidUrl(props.group.avatar_url + "") && <IonIcon className="groupCardIcon" src={props.icon}></IonIcon>}
        </IonRow>
        <IonRow className="my-2">
          <IonText className="text-ellipsis font-semibold text-lg font-poppins truncate">
            {props.group.name}
          </IonText>
        </IonRow>
        <div className="avatar-group -space-x-3 rtl:space-x-reverse ml-[-2px]">
          {approvedMembers.map((m, i) => {
            if (i <= 5)
              return (
                <div className="avatar" key={m.id + i}>
                  <div className="w-6 h-auto">
                    {isValidUrl(m.avatar_url + "") ? (
                      <img src={m.avatar_url + ""} />
                    ) : (
                      <IonIcon
                        className="text-3xl m-[-3px]"
                        icon={personCircle}
                        style={{ color: memberColors[i] }}
                      />
                    )}
                  </div>
                </div>
              )
          })}
          {approvedMembers.length > 6 && <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content w-6 h-auto">
              <IonText>
                <span>+{props.group.approx_members_count - 6}</span>
              </IonText>
            </div>
          </div>}
        </div>
      </IonCard>
    </IonCol>
  );
}

GroupCard.defaultProps = {
  icon: peopleCircleOutline,
};
