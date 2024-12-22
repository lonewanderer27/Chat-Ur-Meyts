import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonLabel,
  IonModal,
  IonRow,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  useIonRouter,
  useIonViewWillEnter,
} from "@ionic/react";
import { object, string } from "yup";

import { EmailOTP_Continue_Enum } from "../../enums/continue";
import OtpInput from "react-otp-input";
import { chevronBackOutline } from "ionicons/icons";
import client from "../../client";
import useSetup from "../../hooks/setup/useSetup";
import { useEffect, useRef, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import MaskEmail from "../../utils/MaskEmail";
import testEmails from "../../constants/allowedTestEmails";
import IsLocalHost from "../../utils/IsLocalHost";
import { User, Session } from "@supabase/supabase-js";
import { useAtom } from "jotai";
import { disableAuthWrapper } from "../../atoms/setup";
import useFeatureFlags from "../../hooks/useFeatureFlags";
import { Keyboard } from '@capacitor/keyboard';
import { Capacitor } from "@capacitor/core";

const EmailOTP_Continue = (props: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { flags, loading, error } = useFeatureFlags();

  // Extract allowed test emails from the feature flags
  const allowedTestEmails = flags["allowed_test_emails"]?.value as unknown as string[];
  console.info("Allowed Test Emails", allowedTestEmails);

  const schema = object({
    email: string()
      .email()
      .required()
      .test(
        "is-adamson-or-allowed",
        `${"Email must be an Adamson email"} ${IsLocalHost() ? " or an allowed test email" : ""}`,
        (value) => {
          if (!value) return false;
          const domain = value.split("@")[1];
          return domain === "adamson.edu.ph" || allowedTestEmails.includes(value);
        }
      ),
    code: string()
      .label("Code")
      .matches(/^[0-9]{6}$/, "Must be a 6-digit code"),
  });

  const [disableAuth, setDisableAuth] = useAtom(disableAuthWrapper);

  const rt = useIonRouter();
  const { handleSubmit, control, setError, clearErrors, reset, getValues, setFocus } =
    useForm<{ email: string; code?: string }>({
      resolver: yupResolver(schema),
    });
  const [processing, setProcessing] = useState(false);
  const [state, setState] = useState<EmailOTP_Continue_Enum>(
    EmailOTP_Continue_Enum.InputEmail
  );

  const handleError: SubmitErrorHandler<{ email: string; code?: string }> = (
    errors,
    e
  ) => {
    console.log(errors);
  };

  // Handle form submission
  const handleEmailOTPSuccess: SubmitHandler<{ email: string }> = async (
    data
  ) => {
    console.log(data);
    // TODO: Send OTP Code using Supabase

    setProcessing(true);

    const { data: data2, error } = await client.auth.signInWithOtp({
      email: data.email,
    });

    if (error) {
      setError("email", {
        type: "manual",
        message: error.message,
      });
      console.error(error);
      setProcessing(false);
      return;
    }

    console.log(data2);
    setProcessing(false);
    setState(EmailOTP_Continue_Enum.VerifyOTP);
  };

  // Handle OTP Submission
  const handleSubmitOTPSuccess: SubmitHandler<{
    email: string;
    code?: string;
  }> = async (data) => {
    console.log("handle submit otp success");
    // fail fast if the code is undefined
    if (!data.code) {
      setError("code", {
        type: "manual",
        message: "Code is required",
      });
      return;
    }

    // TODO: Verify OTP Code using Supabase
    console.log(data);

    setProcessing(true);

    // disable the redirect for a bit
    // so we can determine where to redirect the user
    setDisableAuth(() => true);

    const { data: data2, error } = await client.auth.verifyOtp({
      email: data.email,
      token: data.code,
      type: "email",
    });

    if (error) {
      setError("code", {
        type: "manual",
        message: error.message,
      });
      console.error(error);
      setProcessing(false);
      return;
    }

    console.log(data2);
    setProcessing(false);
    reset();
    onOTPSuccess(data2);
  };

  // Handle what happens if the OTP that was sent to user's email
  // matches the OTP that the user entered
  const onOTPSuccess = async (
    data:
      | {
        user: User | null;
        session: Session | null;
      }
      | {
        user: null;
        session: null;
      }
  ) => {
    if (data.user !== null) {
      // fetch the user's profile
      // if the user is not null
      const { data: profile } = await client
        .from("profiles")
        .select("*")
        .eq("id", data.user?.id)
        .single();

      console.log(profile);

      // try to fetch if there's a draft student for the user
      // that is also complete
      const draftStudent = await client
        .from("draft_students")
        .select("*")
        .eq("user_id", profile!.id)
        .eq("completed", true)
        .limit(1)
        .maybeSingle()

      if (draftStudent.data === null) {
        // if there's no draft student that's complete, 
        // redirect to setup page
        console.log("No complete student info")
        window.location.href = "/setup"
      } else {
        // if there's a draft student that's complete,
        // redirect to the root page
        console.log("Student info found: ", draftStudent.data);
        window.location.href = "/"
      }
    }
  };

  // Handles the back button
  // If the state is in VerifyOTP, it will go back to InputEmail
  // If the state is in InputEmail, it will close the modal
  const handleBack = () => {
    if (state === EmailOTP_Continue_Enum.VerifyOTP) {
      // set the state back
      setState(EmailOTP_Continue_Enum.InputEmail);

      // reset the error from the OTP input
      clearErrors("code");
    } else {
      props.setOpen(false);
    }
  };

  const [keyboard, setKeyboard] = useState(false);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      Keyboard.addListener('keyboardWillShow', () => {
        setKeyboard(true);
      });
      Keyboard.addListener('keyboardWillHide', () => {
        setKeyboard(false);
      });
      return () => {
        Keyboard.removeAllListeners();
      }
    }

  }, []);

  useIonViewWillEnter(() => setFocus("email"), [])

  return (
    <IonModal
      onDidDismiss={() => props.setOpen(false)}
      isOpen={props.open}
      breakpoints={[0, 0.6]}
      initialBreakpoint={0.6}
      backdropDismiss={false}
      handle={false}
      canDismiss={state !== EmailOTP_Continue_Enum.VerifyOTP}
    >
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={handleBack}>
              <IonIcon src={chevronBackOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>
            {state === EmailOTP_Continue_Enum.InputEmail
              ? "Continue with Email"
              : "Enter Verification Code"}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className={`ion-padding ${keyboard ? "pb-20" : ""}`}>
        {state === EmailOTP_Continue_Enum.InputEmail && (
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonLabel className="font-poppins font-semibold text-lg">
                  Adamson Email
                </IonLabel>
                <Controller
                  render={({
                    field: { value, onChange, onBlur, ref },
                    fieldState: { error, isTouched },
                  }) => (
                    <IonInput
                      ref={ref}
                      className={`${error && "ion-invalid"} ${isTouched && "ion-touched"}`}
                      fill="outline"
                      type="email"
                      value={value}
                      onIonChange={onChange}
                      onIonBlur={onBlur}
                      placeholder="Enter your Adamson Email"
                      errorText={error?.message}
                    />
                  )}
                  name="email"
                  control={control}
                />
              </IonCol>
            </IonRow>
            <IonRow className="mt-4">
              <IonCol size="6" />
              <IonCol size="6">
                <IonButton
                  expand="full"
                  shape="round"
                  disabled={processing}
                  onClick={handleSubmit(handleEmailOTPSuccess, handleError)}
                >
                  {processing ? <IonSpinner name="crescent" className="mr-2 h-5" /> : ""} Next
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        )}
        {state === EmailOTP_Continue_Enum.VerifyOTP && (
          <IonGrid>
            <IonRow className="my-2 flex justify-center">
              <IonText className="text-3xl font-poppins font-bold">
                Verification
              </IonText>
            </IonRow>
            <IonRow className="my-2 flex justify-center">
              <IonText className=" font-poppins">
                Your verification code is sent via email to
              </IonText>
              <IonText className="font-poppins">
                {MaskEmail(getValues("email"))}
              </IonText>
            </IonRow>
            <IonRow className="ml-[-4px] my-2 flex justify-center">
              <Controller
                render={({
                  field: { value, onChange, onBlur },
                  fieldState: { error, isTouched },
                }) => (
                  <>
                    <OtpInput
                      numInputs={6}
                      inputType="tel"
                      value={value}
                      onChange={(e) => {
                        onChange(e);
                        if (e.length === 6) {
                          console.log("try to submit as we've reached length of 6");
                          handleSubmit(handleSubmitOTPSuccess, handleError);
                        }
                      }}
                      onPaste={() => {
                        // wait for a bit before submitting
                        setTimeout(() => {
                          handleSubmit(handleSubmitOTPSuccess, handleError)();
                        }, 500);
                      }}
                      containerStyle={"flex flex-row justify-center mt-3"}
                      inputStyle={
                        "border-2 mx-1 rounded-lg w-25 font-poppins text-center text-5xl"
                      }
                      renderInput={(props) => <input {...props} />}
                    />
                    {error && (
                      <IonLabel color="danger" className="p-2">
                        {error?.message}
                      </IonLabel>
                    )}
                  </>
                )}
                name="code"
                control={control}
              />
              { }
            </IonRow>
            <IonRow className="mt-4 ml-[-5px]">
              <IonCol size="12">
                <IonButton
                  shape="round"
                  expand="block"
                  disabled={processing}
                  onClick={handleSubmit(handleSubmitOTPSuccess, handleError)}
                >
                  {processing ? <IonSpinner name="crescent" className="mr-2 h-5" /> : ""} Submit
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        )}
      </IonContent>
    </IonModal>
  );
};

export default EmailOTP_Continue;
