import { ComponentProps, useMemo } from "react";
import {
  IonAvatar,
  IonButton,
  IonIcon,
  IonImg,
  useIonRouter,
} from "@ionic/react";

import { peopleCircleOutline } from "ionicons/icons";

type BtnProps = ComponentProps<typeof IonButton> & {
  route?: string;
  icon?: string;
  avatarUrl?: string | null | undefined;
  size?: "small" | "default" | "large";
};

export default function NavBtn(props: BtnProps) {
  const rt = useIonRouter();
  const isValidUrl = useMemo(() => {
    try {
      new URL(props.avatarUrl + "");
      return true;
    } catch (_) {
      return false;
    }
  }, [props.avatarUrl]);

  const handleClick = () => {
    if (props.route) rt.push(props.route);
  };

  return (
    <IonButton
      onClick={handleClick}
      className="ml-4"
      {...props}
      size={props.size}
    >
      {props.avatarUrl && isValidUrl ? (
        <img src={props.avatarUrl} className="w-8 h-auto rounded-full" />
      ) : (
        <IonIcon className="" icon={props.icon} />
      )}
    </IonButton>
  );
}

NavBtn.defaultProps = {
  size: "default",
  icon: peopleCircleOutline,
};
