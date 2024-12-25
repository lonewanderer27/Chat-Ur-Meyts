import { yupResolver } from "@hookform/resolvers/yup";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonSpinner,
  IonText,
  IonTextarea,
  IonToolbar,
  useIonRouter,
  useIonViewWillEnter,
} from "@ionic/react";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { RouteComponentProps } from "react-router";
import { NewStudentTypeSteps } from "../../types/student/post/NewStudentType";
import { object, string } from "yup";
import { useAtom } from "jotai";
import { newStudentAtom } from "../../atoms/student";
import { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import { hideTabBar } from "../../utils/TabBar";
import useSetupDraftStudent from "../../hooks/setup/useSetupDraftStudent";
import useSelfDraftStudent from "../../hooks/me/useSelfDraftStudent";
import useSelfSetupDraftStudent from "../../hooks/setup/useSelfSetupDraftStudent";

// VS = Validation Schema
export const VSIntroduceYourself = object().shape({
  fullName: string().required("Your full name is required").min(2),
  description: string().optional(),
});

const Setup2IntroduceYourself: FC<RouteComponentProps> = ({ match }) => {
  useIonViewWillEnter(() => {
    hideTabBar();
  });

  const ds = useSelfSetupDraftStudent();

  const [newStudent, setNewStudent] = useAtom(newStudentAtom);
  const {
    register,
    handleSubmit,
    getFieldState,
    formState: { errors },
  } = useForm<NewStudentTypeSteps["step1"]>({
    resolver: yupResolver(VSIntroduceYourself),
    defaultValues: async () => {
      // check if there is a value in the student atom
      // if there is, set the default values to that
      // else, set the default values to an empty object
      return {
        fullName: newStudent.step1.fullName || ds.data?.full_name || "",
        description: newStudent.step1.description || ds.data?.description || "",
      };
    },
  });
  const { handleNext: next } = useSetupDraftStudent();

  const [checking, setChecking] = useState(() => false);
  const handleError: SubmitErrorHandler<NewStudentTypeSteps["step1"]> = (
    errors,
  ) => {
    console.log("handleError");
    console.log(errors);
  };
  const { handleDraftIntroduceYourself } = useSetupDraftStudent();

  const handleNext: SubmitHandler<NewStudentTypeSteps["step1"]> = async (
    data
  ) => {
    console.log("handleNext");
    console.log(data);
    setChecking(() => true);
    setNewStudent((prev) => ({
      ...prev,
      step1: data,
    }));

    // update the draft student record with the data
    await handleDraftIntroduceYourself({
      full_name: data.fullName,
      description: data.description,
    }, ds.data?.id!);

    // refetch the draft student record
    await ds.refetch();

    setChecking(() => false);

    // route to next page
    next();
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton
                defaultHref={"/" + match.path.split("/")[1]}
                text=""
              />
            </IonButtons>
            {/* <IonTitle>Introduce Yourself</IonTitle> */}
          </IonToolbar>
        </IonHeader>
        <IonGrid className="mt-[10px]">
          <IonRow className="pb-[20px]">
            <IonCol>
              <IonText className="text-center">
                <h3>Introduce Yourself</h3>
              </IonText>
            </IonCol>
          </IonRow>
          <IonList className="rounded-xl">
            <IonItem lines="none" className="mb-[-10px]">
              <IonLabel>
                <IonText className="font-poppins font-semibold text-lg">
                  Full Name
                </IonText>
              </IonLabel>
            </IonItem>
            <IonItem lines="full">
              <IonInput
                className={`my-2 text-lg ${getFieldState("fullName").isTouched ? "ion-touched" : ""
                  } ${errors.fullName
                    ? "ion-touched ion-invalid border-red-500"
                    : ""
                  }`}
                type="text"
                errorText={errors.fullName?.message}
                placeholder="Enter your full name"
                {...register("fullName")}
              />
            </IonItem>
            <IonItem lines="none" className="mb-[-10px]">
              <IonLabel>
                <IonText className="font-poppins font-semibold text-lg">
                  Description
                </IonText>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonTextarea
                className={`my-2 text-lg ${getFieldState("fullName").isTouched ? "ion-touched" : ""
                  } ${errors.description
                    ? "ion-touched ion-invalid border-red-500"
                    : ""
                  }`}
                errorText={errors.description?.message}
                placeholder="Introduce yourself to fellow klasmeyts"
                rows={5}
                {...register("description")}
              />
            </IonItem>
          </IonList>
        </IonGrid>
      </IonContent>
      <IonFooter>
        <IonToolbar className="p-4 flex justify-end">
          <IonButton
            shape="round"
            slot="end"
            size="small"
            onClick={handleSubmit(handleNext, handleError)}
          >
            <IonText className="py-3">
              {checking ? <IonSpinner name="dots" /> : <span>Next</span>}
            </IonText>
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Setup2IntroduceYourself;
