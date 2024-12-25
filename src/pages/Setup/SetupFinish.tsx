import {
  IonButton,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonIcon,
  IonImg,
  IonPage,
  IonProgressBar,
  IonRow,
  IonText,
  IonToolbar,
  useIonRouter,
  useIonViewWillEnter,
} from "@ionic/react";
import RecommendService from "../../services/recommend";
import { hideTabBar } from "../../utils/TabBar";
import { FC, useState } from "react";
import { RouteComponentProps } from "react-router";
import useSetupDraftStudent from "../../hooks/setup/useSetupDraftStudent";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// @ts-ignore
import StudentLoading from "../../assets/studentLoading.lottie";
import useRecommendRealGroups from "../../hooks/recommend/useRecommendRealGroups";
import useSelfDraftStudent from "../../hooks/me/useSelfDraftStudent";
import useSelfSetupDraftStudent from "../../hooks/setup/useSelfSetupDraftStudent";

enum FinishPageState {
  UPLOADING = "uploading",
  FINISH = "finish",
  IDLE = "idle"
}

const Setup6Finish: FC<RouteComponentProps> = () => {
  const [pageState, setPageState] = useState(() => FinishPageState.IDLE);
  useIonViewWillEnter(() => {
    hideTabBar();
  });

  const rt = useIonRouter();
  const RRG = useRecommendRealGroups(10);
  const DSRQ = useSelfSetupDraftStudent();
  const { handleCompleteStudent, simulateCompleteStudent, uploading, loadingMsg, uploadProgress } = useSetupDraftStudent();
  const handleNext = () => {
    // TODO: We should have a better way to handle this
    // for example, what if the recommendation is not available?
    rt.push("/recommend/groups", "forward", "replace");
  }

  const completeStudent = async () => {
    // get current query params
    const currentParams = window.location.search;

    // get sessionId from query params
    const urlParams = new URLSearchParams(currentParams);

    // get sessionId from query params
    const sessionId = urlParams.get("sessionId");

    if (sessionId) {
      try {
        // set the page state to uploading
        setPageState(FinishPageState.UPLOADING);

        // complete the student setup
        await handleCompleteStudent(sessionId);

        // refresh the backend data
        await RecommendService.refreshRealGroups();

        // refetch the real groups
        await RRG.refetch();

        // refetch draft student
        await DSRQ.refetch();

        // set the page state to finish
        setPageState(FinishPageState.FINISH);
      }
      catch (error) {
        setPageState(FinishPageState.IDLE);
        console.error("Error completing student setup", error);
      }
    } else {
      console.error("sessionId is missing");
    }
  }

  const handleSimulateCompleteStudent = async () => {
    setPageState(FinishPageState.UPLOADING);
    await simulateCompleteStudent();
    setPageState(FinishPageState.FINISH);
  }

  return (
    <IonPage>
      <IonContent className="ion-padding">
        {pageState === FinishPageState.IDLE && <IonGrid className="my-auto mt-32">
          <IonRow>
            <DotLottieReact
              src={StudentLoading}
              className="h-[350px] w-auto mx-auto"
            />
          </IonRow>
        </IonGrid>}
        {pageState === FinishPageState.UPLOADING && <IonGrid className="my-auto mt-32">
          <IonRow>
            <DotLottieReact
              src={StudentLoading}
              autoplay
              loop
              className="h-[350px] w-auto mx-auto"
            />
          </IonRow>
          <IonRow className="mt-[50px]">
            <IonCol>
              <IonText className="text-center">
                <h5>{loadingMsg.length > 0 ? loadingMsg : "Loading..."}</h5>
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow className="text-center">
            <IonCol>
              <IonProgressBar className="mx-auto w-[90%]" value={uploadProgress} />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText className="text-center">
                <h6>{uploadProgress < 100 ? uploadProgress * 100 : uploadProgress}%</h6>
              </IonText>
            </IonCol>
          </IonRow>
        </IonGrid>}
        {pageState === FinishPageState.FINISH && <IonGrid className="my-auto mt-32">
          <IonRow className="flex text-center ">
            <IonCol>
              <IonImg src={"/logo_w_name.png"} className=" w-20 mx-auto" />
              <IonText className="font-bold">
                <h3>Setup Finished</h3>
              </IonText>
              <IonText>
                <p>Congratulations!</p>
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow className="py-20">
            {/* <IonCol size="3">
              <IonButton fill="clear">
                <IonIcon
                  slot="end"
                  size="large"
                  color="medium"
                  icon={helpCircleOutline}
                />
              </IonButton>
            </IonCol> */}
            <IonCol>
              <IonText className="text-center">
                <p>
                  The profile setup is completed successfully! Let us show you
                  our recommended classmates and groups just for you.
                </p>
              </IonText>
            </IonCol>
          </IonRow>
        </IonGrid>}
      </IonContent>
      <IonFooter>
        {pageState === FinishPageState.IDLE && (
          <IonToolbar className="ion-padding">
            <IonButton expand="full" shape="round" onClick={completeStudent}>
              Complete Setup
            </IonButton>
          </IonToolbar>
        )}
        {pageState === FinishPageState.FINISH && (
          <IonToolbar className="ion-padding flex justify-end">
            <IonButton expand="full" shape="round" onClick={handleNext}>
              Show Recommendations
            </IonButton>
          </IonToolbar>
        )}
      </IonFooter>
    </IonPage>
  );
};

export default Setup6Finish;
