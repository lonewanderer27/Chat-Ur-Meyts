import { IonCard, IonCol, IonIcon, IonLabel, IonText, useIonRouter } from "@ionic/react";

import { addCircleOutline } from "ionicons/icons";

export default function AddGroupCard() {
  const rt = useIonRouter()
  function handleClick() {
    rt.push("/group/create/p1");
  }

  return (
    <IonCol size="6" className="flex flex-column w-full cursor-pointer">
      <div
        className=" ion-padding ion-no-margin w-full flex flex-col  align-items-center justify-center text-center"
        onClick={handleClick}
      >
        <IonIcon className="text-5xl mx-auto" src={addCircleOutline} color="medium"></IonIcon>
        <IonLabel className="my-2 text-lg font-poppins font-semibold" color="medium">New Group</IonLabel>
      </div>
    </IonCol>
  );
}
