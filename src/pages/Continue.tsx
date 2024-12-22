import { IonButton, IonContent, IonFooter, IonIcon, IonImg, IonPage, IonText, useIonRouter, useIonViewWillEnter } from "@ionic/react";
import { boolean, object, ref, string } from 'yup';
import { logoGoogle, mailOutline } from "ionicons/icons";
import { StatusBar } from '@capacitor/status-bar';

import EmailOTP_Continue from "../components/ContinuePage/EmailOTP_Continue";
import useGoogle from "../hooks/auth/useGoogle";
import useSession from "../hooks/auth/useSession";
import { useState } from "react";
import { Capacitor } from "@capacitor/core";
import useFeatureFlags from "../hooks/useFeatureFlags";

export const formSchema = object().shape({
  email: string().email().required().label("Email").matches(/^[a-zA-Z0-9._%+-]+@adamson\.edu\.ph$/, "Must be an Adamson mail"),
  fullName: string().required().label("Full Name"),
  password: string().required().label("Password"),
  passwordConfirmation: string().required("Confirm Password is a required field").oneOf([ref("password")], "Passwords must match"),
  agreeToTerms: boolean().required("You must agree to the terms and conditions")
})

export default function Continue() {
  const [open, setOpen] = useState(false);
  const { flags, loading, error } = useFeatureFlags();

  const rt = useIonRouter();
  const { session } = useSession();

  const handleContinue = () => {
    if (session) {
      rt.push("/discover", "forward", "replace");
    } else {
      setOpen(true);
    }
  }

  const { handleGoogle } = useGoogle({});

  const handleTermsOfService = () => {
    // Handle terms of service
  }

  const handlePrivacyPolicy = () => {
    // Handle privacy policy
  }

  useIonViewWillEnter(() => {
    if (Capacitor.isNativePlatform() === false) return;

    StatusBar.setOverlaysWebView({ overlay: true });
  }, []);

  // Check if feature flags enable Google login, Terms of Service, and Privacy Policy
  const isGoogleLoginEnabled = (flags["google_sign_in"]?.value as unknown as boolean) ?? false;
  const isTermsOfServiceEnabled = (flags['tos_display']?.value as unknown as boolean) ?? false;
  const isPrivacyPolicyEnabled = (flags['privacy_policy_display']?.value as unknown  as boolean) ?? false;

  console.info("isGoogleLoginEnabled", isGoogleLoginEnabled);
  console.info("isTermsOfServiceEnabled", isTermsOfServiceEnabled);
  console.info("isPrivacyPolicyEnabled", isPrivacyPolicyEnabled);

  return (
    <IonPage>
      <EmailOTP_Continue open={open} setOpen={setOpen} />
      <IonContent className="ion-padding">
        <video
          className="fixed z-[-10] top-0 left-0 min-w-full min-h-full w-auto h-auto transform object-cover"
          autoPlay
          muted
          loop
        >
          <source src="/480.mp4" type="video/mp4" />
        </video>
        <IonImg src="/logo_w_name.png" className="w-32 mx-auto mt-28" />
      </IonContent>
      <IonFooter className="ion-padding text-center">
        <div className="mb-32">
          <IonButton expand="block" color='light' onClick={handleContinue} shape="round">
            Continue with Email
            <IonIcon slot="start" src={mailOutline} />
          </IonButton>
          {isGoogleLoginEnabled === true && Capacitor.isNativePlatform() === false && (
            <IonButton
              onClick={handleGoogle}
              expand="block"
              fill="clear"
              size="small"
              className="mt-4"
              color="light"
            >
              <IonIcon slot="start" icon={logoGoogle} />
              Continue with Google
            </IonButton>
          )}
        </div>

        {(isTermsOfServiceEnabled === true || isPrivacyPolicyEnabled === true) && (
          <IonText color="light">
            By continuing, you confirm that you agree to our{' '}
            {isTermsOfServiceEnabled && (
              <span className="underline" onClick={handleTermsOfService}>Terms of Service</span>
            )}
            {isTermsOfServiceEnabled && isPrivacyPolicyEnabled && ' and '}
            {isPrivacyPolicyEnabled && (
              <span className="underline" onClick={handlePrivacyPolicy}>Privacy Policy</span>
            )}.
          </IonText>
        )}
      </IonFooter>
    </IonPage>
  );
}
