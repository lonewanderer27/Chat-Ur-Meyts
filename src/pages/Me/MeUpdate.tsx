import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonInput,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonSpinner,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import React, { FC } from "react";
import { hideTabBar } from "../../utils/TabBar";

import { Controller } from "react-hook-form";
import AvatarLarge from "../../components/Me/AvatarLarge";
import { RouteComponentProps } from "react-router";
import StudentItem from "../../components/SearchPage/StudentItem";
import useSelfStudent from "../../hooks/student";
import useUpdateInfo from "../../hooks/me/useUpdateInfo";

const MeUpdate: FC<RouteComponentProps> = ({ match }) => {
  const { student } = useSelfStudent();
  const {
    handleSubmit,
    handleSave,
    handleError,
    saving,
    control,
  } = useUpdateInfo();
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
                disabled={saving}
                className="ml-[-5px]"
                defaultHref="/community"
                text={""}
              />
            </IonButtons>
            <IonTitle>Update Your Profile</IonTitle>
            <IonButtons slot="end">
              <IonButton
                disabled={saving}
                onClick={handleSubmit(handleSave, handleError)}
              >
                {saving ? (
                  <IonSpinner name="dots" />
                ) : (
                  <IonText>Save</IonText>
                )}
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <div className="flex justify-center mb-[-80px] z-[500]">
          <AvatarLarge avatarUrl={student?.avatar_url} />
        </div>
        <IonCard className="pt-16 mx-0 z-[-500]">
          <IonCardContent>
            <IonLabel
              className="font-poppins font-semibold"
            >
              Full Name
            </IonLabel>
            <Controller
              render={({
                field: { value, onChange, onBlur },
                fieldState: { error, isTouched },
              }) => (
                <IonInput
                  className={`${error && "ion-invalid"} ${isTouched && "ion-touched"}`}
                  fill="outline"
                  value={value}
                  onIonChange={onChange}
                  onIonBlur={onBlur}
                  errorText={error?.message}
                  helperText="You must upload an updated Certificate of Enrollment to update your full name."
                  readonly
                />
              )}
              name="fullName"
              control={control}
            />
          </IonCardContent>
        </IonCard>
        <IonCard className="mx-0 z-[-500]">
          <IonCardContent>
            <IonLabel
              className="font-poppins font-semibold text-l"
              color="medium"
            >
              Bio
            </IonLabel>
            <Controller
              render={({
                field: { value, onChange, onBlur },
                fieldState: { error, isTouched },
              }) => (
                <IonTextarea
                  autoGrow
                  counter
                  className={`${error && "ion-invalid"} ${isTouched && "ion-touched"}`}
                  fill="outline"
                  value={value}
                  onIonChange={onChange}
                  onIonBlur={onBlur}
                  errorText={error?.message}
                  placeholder="Introduce yourself to your klasmeyts"
                />
              )}
              name="description"
              control={control}
            />
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default MeUpdate;
