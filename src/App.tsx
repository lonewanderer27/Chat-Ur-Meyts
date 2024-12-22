/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
// import Swiper styles
import "swiper/css";
// import react slick styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "@ionic/react/css/palettes/dark.class.css";
import "@ionic/react/css/palettes/high-contrast.class.css";
import "./theme/high-contrast-dark.css";
import "./theme/high-contrast-light.css";

/* Theme variables */
import "./theme/variables.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

import { IonApp, IonTabs, IonRouterOutlet, IonFab, IonFabButton, IonIcon, setupIonicReact, IonLabel, IonTabBar, IonTabButton } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { Route, Redirect } from "react-router";
import AuthWrapper from "./components/Auth/AuthWrapper";
import DefaultFallback from "./fallbacks";
import TabIconChangerWrapper from "./TabIconChangerWrapper";
import useDraggableFab from "./hooks/useDraggableFab";
import { accessibilitySharp, chatboxEllipsesOutline, chatboxOutline, compassOutline, compassSharp, peopleOutline, peopleSharp } from "ionicons/icons";
import AccessibilitySettings from "./components/AccessibilitySettings";
import { isPlatform } from '@ionic/react';
import DiscoverRoute from "./routes/DiscoverRoute";
const ContinueRoute = lazy(() => import("./routes/ContinueRoute"));
const CommunityRoute = lazy(() => import("./routes/CommunityRoute"));
const ThreadsRoute = lazy(() => import("./routes/ThreadsRoute"));
// const SetupRoute = lazy(() => import("./routes/SetupRoute"));
import SetupRoute from "./routes/SetupRoute";
const SurveysRoute = lazy(() => import("./routes/SurveysRoute"));
import RecommendRoute from "./routes/RecommendRoute";
import MeRoute from "./routes/MeRoute";
import StudentRoute from "./routes/StudentRoute";
import GroupRoute from "./routes/GroupRoute";
// const RecommendRoute = lazy(() => import("./routes/RecommendRoute"));
const Inbox = lazy(() => import("./pages/Inbox"));
const NotFound = lazy(() => import("./routes/NotFound"));

setupIonicReact({
  mode: "ios",
});

// Check if the app is running in a native Capacitor environment
const isNative = isPlatform("capacitor");

// register service worker if we're not capacitor
if (!isNative) {
  // Register the service worker only for web deployments
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
  }
}

// instantiate tanstack client
export const qClient = new QueryClient();

const App = () => {
  const { fabRef } = useDraggableFab();
  return (
    <QueryClientProvider client={qClient}>
      <Suspense fallback={<DefaultFallback />}>
        <IonApp>
          <IonReactRouter>
            <IonTabs>
              <IonRouterOutlet>
                <TabIconChangerWrapper>
                  <AuthWrapper>
                    <Route path="/discover" component={DiscoverRoute} />
                    <Route path="/community" component={CommunityRoute} />
                    <Route path="/threads" component={ThreadsRoute} />
                    <Route path="/me" component={MeRoute} />
                    <Route path="/group" component={GroupRoute} />
                    <Route path="/student" component={StudentRoute} />
                    <Route path="/setup" component={SetupRoute} />
                    <Route path="/surveys" component={SurveysRoute} />
                    <Route path="/recommend" component={RecommendRoute} />
                    <Route path="/inbox" component={Inbox} />
                    <Route path="/undefined" component={() => <Redirect to="/discover" />} exact />
                    <Route path="/null" component={() => <Redirect to="/discover" />} exact />
                    <Route
                      path="/"
                      component={() => <Redirect to="/discover" />}
                      exact
                    />
                  </AuthWrapper>
                  <Route path="/continue" component={ContinueRoute} />
                  {/* <Route render={() => <Redirect to="/not-found" />} /> */}
                  <Route path="/not-found" component={NotFound} />
                  <Route path="/terms-of-service" component={NotFound} />
                  <Route path="/privacy-policy" component={NotFound} />
                </TabIconChangerWrapper>
              </IonRouterOutlet>
              <IonTabBar slot="bottom" translucent>
                <IonTabButton tab="discover" href="/discover">
                  <IonIcon
                    id="discoverTabButton"
                    aria-hidden="true"
                    icon={
                      location.pathname === "/discover"
                        ? compassSharp
                        : compassOutline
                    }
                  />
                  <IonLabel>Discover</IonLabel>
                </IonTabButton>
                <IonTabButton tab="community" href="/community">
                  <IonIcon
                    id="communityTabButton"
                    aria-hidden="true"
                    icon={
                      location.pathname === "/community"
                        ? peopleSharp
                        : peopleOutline
                    }
                  />
                  <IonLabel>Community</IonLabel>
                </IonTabButton>
                <IonTabButton tab="threads" href="/threads">
                  <IonIcon
                    id="threadsTabButton"
                    aria-hidden="true"
                    icon={
                      location.pathname === "/threads"
                        ? chatboxEllipsesOutline
                        : chatboxOutline
                    }
                  />
                  <IonLabel>Threads</IonLabel>
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
            <IonFab
              ref={fabRef}
              style={{ marginBottom: 60 }}
              vertical="bottom"
              horizontal="end"
            >
              <IonFabButton size="small" id="open-modal">
                <IonIcon
                  size="small"
                  icon={accessibilitySharp}
                ></IonIcon>
              </IonFabButton>
            </IonFab>
            <AccessibilitySettings />
          </IonReactRouter>
        </IonApp>
      </Suspense>
    </QueryClientProvider>
  );
};

export default App;
