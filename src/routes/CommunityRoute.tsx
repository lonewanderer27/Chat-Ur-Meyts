import { IonRouterOutlet } from "@ionic/react";
import React, { Suspense } from "react";
import { Route, RouteComponentProps } from "react-router";
import DefaultFallback from "../fallbacks";
const Community = React.lazy(() => import("../pages/Community"));
const Inbox = React.lazy(() => import("../pages/Inbox"));
const SearchPage = React.lazy(() => import("../pages/Search"));

const CommunityRoute: React.FC<RouteComponentProps> = ({ match }) => {
  console.log(match);

  return (
    <IonRouterOutlet id="community">
      <Suspense fallback={<DefaultFallback />}>
        <Route path={match.url} component={Community} exact />
        <Route path={`${match.url}/search`} component={SearchPage} exact />
        <Route path={`${match.url}/inbox`} component={Inbox} exact />
      </Suspense>
    </IonRouterOutlet>
  );
};

export default CommunityRoute;
