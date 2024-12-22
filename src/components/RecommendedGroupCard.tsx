import { IonAvatar, IonCard, IonCol, IonIcon, IonRow, IonText, useIonRouter } from "@ionic/react";
import { GroupMemberType, GroupType, StudentType } from "../types"
import { isValidUrl } from "../utils/ValidUrl";
import { peopleCircleOutline, personCircle } from "ionicons/icons";
import { useMemo } from "react";
import { getRandomColor } from "./GroupCard/ColorPalette";

interface GTM extends GroupMemberType {
  student: StudentType;
}

interface GT extends GroupType {
  group_members: GTM[];
}

const RecommendedGroupCard = (props: {
  group: GT;
  hideMembers?: boolean;
  icon?: string;
}) => {
  const rt = useIonRouter();
  const handleView = () => {
    rt.push("/group/vu/" + props.group.vanity_id);
  };

  // Memoize approved members to avoid recalculating if group members don't change
  const approvedMembers = useMemo(
    () => props.group.group_members.filter((m) => m.approved === true),
    [props.group.group_members.length]
  )

  // Generate and memoize random colors for each member without an avatar
  const memberColors = useMemo(() => {
    return approvedMembers.map(() => getRandomColor());
  }, [approvedMembers.length]);

  return (
    <IonCol
      size="6"
      className="flex flex-col w-full cursor-pointer">
      <IonCard
        className="ion-padding ion-no-margin w-full font-poppins"
        onClick={handleView}
      >
        <IonRow className="ml-[-5px]">
          {isValidUrl(props.group.avatar_url + "") && <IonAvatar>
            <img className="w-[50px] h-auto object-cover rounded-full aspect-square" src={props.group.avatar_url!} />
          </IonAvatar>}
          {!isValidUrl(props.group.avatar_url + "") && <IonIcon className="text-6xl" src={props.icon}></IonIcon>}
        </IonRow>
        <IonRow className="my-2">
          <IonText className="text-ellipsis font-semibold text-lg font-poppins truncate" title={props.group.name}>
            {props.group.name}
          </IonText>
        </IonRow>
        {!props.hideMembers &&
          <div className="ml-[12px] flex flex-nowrap">
            {approvedMembers.map((m, i) => {
              if (i + 1 <= 6)
                return (
                  <div className="avatar ml-[-16px]" title={m.student.full_name ?? ""} key={m.id + i}>
                    {isValidUrl(m.avatar_url + "") ? (
                      <img src={m.avatar_url + ""} />
                    ) : (
                      <IonIcon
                        className="text-4xl"
                        icon={personCircle}
                        style={{ color: memberColors[i] }}
                      />
                    )}
                  </div>
                )
            })}
          </div>}
      </IonCard>
    </IonCol>
  )
}

RecommendedGroupCard.defaultProps = {
  icon: peopleCircleOutline
}

export default RecommendedGroupCard