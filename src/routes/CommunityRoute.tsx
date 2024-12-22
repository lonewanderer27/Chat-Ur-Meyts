import { IonRouterOutlet } from "@ionic/react";
import React from "react";
import { Route, RouteComponentProps } from "react-router";

import Community from "../pages/Community";
import Inbox from "../pages/Inbox";
import SearchPage from "../pages/Search";

const CommunityRoute: React.FC<RouteComponentProps> = ({ match }) => {
  console.log(match);

  return (
    <IonRouterOutlet id="community">
      <Route path={match.url} component={Community} exact />
      <Route path={`${match.url}/search`} component={SearchPage} exact />
      <Route path={`${match.url}/inbox`} component={Inbox} exact />
    </IonRouterOutlet>
  );
};

export default CommunityRoute;
