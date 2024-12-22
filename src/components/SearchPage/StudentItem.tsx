import "./StudentItem.css";

import { IonAvatar, IonCol, IonIcon, IonItem, IonLabel, IonRow, IonText, useIonRouter, } from "@ionic/react";
import { mail, personCircleOutline } from "ionicons/icons";
import { StudentType } from "../../types";
import { useMemo } from "react";

export default function StudentItem(props: {
  student: StudentType;
  icon?: string;
  showType?: boolean;
  showBtn?: boolean;
  buttonLabel?: string;
  buttonIcon?: string;
  me?: boolean;
}) {
  const rt = useIonRouter();
  const isValidUrl = useMemo(() => {
    try {
      new URL(props.student.avatar_url + "");
      return true;
    } catch (_) {
      return false;
    }
  }, [props.student.avatar_url]);
  
  function handleClick() {
    // get the main pathname like /community
    const mainPathname = rt.routeInfo.pathname.split("/")[1];

    // if me is true, then we are this person
    if (props.me) {
      rt.push("/"+mainPathname+"/me");
      return;
    }
    
    // otherwise we are looking at someone else
    // rt.push("/"+mainPathname+"/student/id/" + props.student.id);
    rt.push("/student/id/"+props.student.id);
  }

  return (
    <IonItem lines="full" onClick={handleClick} className="cursor-pointer">
      {props?.student.avatar_url && isValidUrl ? (
        <IonAvatar slot="start" className="mr-3 studentItemLogo">
          <img className="studentItemLogo" src={props!.student.avatar_url} />
        </IonAvatar>
      ) : (
        <IonIcon
          className="studentItemIcon"
          slot="start"
          icon={props.icon}
        ></IonIcon>
      )}
      <IonLabel>
        <h2 className="truncate">{props?.student.full_name}</h2>
        {props.showType && (
          <p className="studentType text-sm mt-[-30px]" color="medium">
            {props.student.type === "regular" ? "Block " + props.student.block?.toUpperCase() : "Irregular"}
          </p>
        )}
      </IonLabel>
    </IonItem>
  );
}

StudentItem.defaultProps = {
  icon: personCircleOutline,
  buttonLabel: "Message",
  buttonIcon: mail,
  showBtn: true,
  showType: true,
};
