import { IonRouterOutlet } from "@ionic/react";
import React from "react";
import { Route, RouteComponentProps } from "react-router";

import Community from "../pages/Community";
import Me from "../pages/Community/Me";
import MeFollowing from "../pages/Community/Me/MeFollowing";
import MeGroups from "../pages/Community/Me/MeGroups";
import MeUpdate from "../pages/Community/Me/MeUpdate";
import StudentFollowing from "../pages/Community/Student/StudentFollowing";
import StudentGroups from "../pages/Community/Student/StudentGroups";
import StudentPage from "../pages/Community/StudentPage";

const MeRoute: React.FC<RouteComponentProps> = ({ match }) => {
  console.log(match);

  return (
    <IonRouterOutlet id="me">
      <Route path={match.url} component={Community} exact />
      <Route path={`${match.url}`} component={Me} exact />
      <Route path={`${match.url}/groups`} component={MeGroups} exact />
      <Route path={`${match.url}/following`} component={MeFollowing} exact />
      <Route path={`${match.url}/update`} component={MeUpdate} exact />
      <Route
        path={`${match.url}/student/id/:student_id`}
        component={StudentPage}
        exact
      />
      <Route
        path={`${match.url}/student/id/:student_id/following`}
        component={StudentFollowing}
        exact
      />
      <Route
        path={`${match.url}/student/id/:student_id/groups`}
        component={StudentGroups}
        exact
      />
    </IonRouterOutlet>
  );
};

export default MeRoute;