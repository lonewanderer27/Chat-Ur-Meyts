import {
  IonButton,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonIcon,
  IonImg,
  IonPage,
  IonRow,
  IonToolbar,
  useIonRouter,
  useIonViewWillEnter,
} from "@ionic/react";

import { IonText } from "@ionic/react";
import {
  helpCircleOutline,
} from "ionicons/icons";
import { hideTabBar } from "../utils/TabBar";
import { FC, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import client from "../client";
import useSession from "../hooks/auth/useSession";
import useSelfDraftStudent from "../hooks/me/useSelfDraftStudent";
import useSetupDraftStudent from "../hooks/setup/useSetupDraftStudent";
import useSelfSetupDraftStudent from "../hooks/setup/useSelfSetupDraftStudent";
import { useAtom } from "jotai";
import { createWorker } from "tesseract.js";
import { workerAtom } from "../atoms/setup";

const Setup: FC<RouteComponentProps> = () => {
  const { session } = useSession();
  const ds = useSelfDraftStudent();
  console.log("draftStudent: ", ds.data)
  const rt = useIonRouter()
  const [worker, setWorker] = useAtom(workerAtom)

  useEffect(() => {
    if (worker === null) {
      const initWorker = async () => {
        const wk = await createWorker('eng', 1, {
          logger: m => console.log(m),
          cacheMethod: "none"
        })
  
        setWorker(wk);
      };
  
      initWorker();
    } else {
      console.log("Worker has been initialized!")
      console.log(worker);
    }
  }, [])

  useEffect(() => {
    // if there's a draft student record and it's not completed
    if (ds.data !== null && ds.data?.completed === false) {
      // set the id to be of sessionId in the query params
      rt.push(`/setup?sessionId=${ds.data.id}`, "forward", "replace")
    }

    // if there's none then create a new draft student record
    // and set the id to be of sessionId in the query params
    if (ds.data === null && session !== null) {
      (async () => {
        const newDraftStudent = await client
          .from("draft_students")
          .insert({
            user_id: session?.user.id!,
            completed: false,
            school_email: (await client.auth.getUser()).data.user?.email,
          })
          .select("*")
          .single()

        if (newDraftStudent.error) {
          console.error(newDraftStudent.error)
          throw new Error(newDraftStudent.error.message)
        }

        // refetch the draft student record
        ds.refetch()

        rt.push(`/setup?sessionId=${newDraftStudent.data.id}`, "forward", "replace")
      })();
    }
  }, [ds.data, session])

  useIonViewWillEnter(() => {
    (async () => {
      // check if there's an existing profile for the user
      const { data: profile, error } = await client
        .from("profiles")
        .select("*, student:students(*), professor:professors(*)")
        .eq("id", session?.user.id!)
        .single();

      console.log(profile, error);

      // if there's student or professor, then redirect them to the home page
      if (profile?.student !== undefined || profile?.professor !== undefined) {
        window.location.href = "/discover";
        return;
      }

      // if there's no student or professor, then they're in the right place!
      // no redirect
      hideTabBar();
    })();
  }, []);

  const { handleNext } = useSetupDraftStudent();

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonGrid className="my-auto mt-32">
          <IonRow className="flex text-center ">
            <IonCol>
              <IonImg src={"/logo_w_name.png"} className=" w-20 mx-auto" />
              <IonText className="font-bold">
                <h3>Setup</h3>
              </IonText>
              <IonText>
                <p>Let's get you started</p>
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow className="py-20">
            <IonCol size="3">
              <IonButton fill="clear">
                <IonIcon
                  slot="end"
                  size="large"
                  color="medium"
                  icon={helpCircleOutline}
                />
              </IonButton>
            </IonCol>
            <IonCol>
              <IonText className="text-start">
                <p>
                  We'll ask you a few questions to help us better understand
                  your academic needs
                </p>
              </IonText>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
      <IonFooter>
        <IonToolbar className="ion-padding flex justify-end">
          <IonButton
            shape="round"
            slot="end"
            size="small"
            onClick={handleNext}
          >
            <IonText className="py-3">
              Get Started
            </IonText>
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Setup;
