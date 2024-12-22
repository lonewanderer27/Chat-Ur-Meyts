import {
  IonCard,
  IonCol,
  IonIcon,
  IonRow,
  IonText,
  useIonRouter,
} from "@ionic/react";

import { ComponentProps } from "react";
import { GroupPostTypeWGroupInfo } from "../../types/group/Post";
import { GroupType } from "../../types";
import { personCircleOutline } from "ionicons/icons";
import { isValidUrl } from "../../utils/ValidUrl";

type IonCardProps = ComponentProps<typeof IonCard>;

export default function PostCard(
  props: IonCardProps & {
    group?: GroupType;
    post?: GroupPostTypeWGroupInfo;
    icon?: string;
  }
) {
  const rt = useIonRouter();
  const handleClick = () => {
    rt.push(`/group/vu/${props.group?.vanity_id}/post/${props.post?.id}`);
  };

  return (
    <IonCard
      className="studentCard ion-padding m-2 font-poppins"
      onClick={handleClick}
    >
      <IonRow>
        {props.group?.admin_uni_group === false && <IonCol size="1">
          {isValidUrl(props.group?.avatar_url + "") ? (
            <img
              className="groupCardAvatar object-cover rounded-full aspect-square mt-1 ml-[-5px] "
              src={props.group?.avatar_url + ""}
            />
          ) : (
            <IonIcon
              className="groupCardIcon"
              src={props.icon}
            ></IonIcon>
          )}
        </IonCol>}
        <IonCol className="flex content-center">
          <IonText className="ml-[-5px]">
            <span className="text-lg font-bold text-ellipsis line-clamp-1 my-auto">
              {props.group?.name ?? "Post"}
            </span>
          </IonText>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonText>
          <p className="line-clamp-3 font-medium">{props.post?.content}</p>
        </IonText>
      </IonRow>
    </IonCard>
  );
}

PostCard.defaultProps = {
  icon: personCircleOutline,
};
