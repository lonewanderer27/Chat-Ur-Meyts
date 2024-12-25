import { IonRouterOutlet } from "@ionic/react";
import { FC, lazy, Suspense } from "react";
import { Redirect, Route, RouteComponentProps } from "react-router";
const RecommendPending = lazy(() => import("../pages/Recommend/RecommendPending"));
const RecommendStudents = lazy(() => import("../pages/Recommend/RecommendStudents"));
const RecommendGroups = lazy(() => import("../pages/Recommend/RecommendGroups"));

import DefaultFallback from "../fallbacks";

const RecommendRoute: FC<RouteComponentProps> = ({ match }) => {
  return (
    <IonRouterOutlet id="recommend">
      <Suspense fallback={<DefaultFallback />}>
        <Route render={() => <Redirect to={`${match.url}/groups`} />} />
        <Route path={`${match.url}/pending`} component={RecommendPending} exact />
        <Route
          path={`${match.url}/students`}
          component={RecommendStudents}
          exact
        />
        <Route path={`${match.url}/groups`} component={RecommendGroups} exact />
      </Suspense>
    </IonRouterOutlet>
  );
};

export default RecommendRoute;
