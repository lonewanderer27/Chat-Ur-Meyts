import { IonRouterOutlet } from "@ionic/react";
import { FC, lazy, Suspense } from "react";
import { Redirect, Route, RouteComponentProps } from "react-router";
import Me from "../pages/Me";
const MeFollowing = lazy(() => import("../pages/Me/MeFollowing"))
const MeGroups = lazy(() => import("../pages/Me/MeGroups"))
const MeUpdate = lazy(() => import("../pages/Me/MeUpdate"))
const UpdateHobbies = lazy(() => import("../pages/Me/MeUpdate/UpdateHobbies"))
const RecommendGroups = lazy(() => import("../pages/Recommend/RecommendGroups"))
import DefaultFallback from "../fallbacks";

const MeRoute: FC<RouteComponentProps> = ({ match }) => {
  console.log(match);

  return (
    <IonRouterOutlet id="me">
      <Route path={match.url} component={Me} exact />
      <Suspense fallback={<DefaultFallback />}>
        <Route path={`${match.url}/groups`} component={MeGroups} exact />
        <Route path={`${match.url}/following`} component={MeFollowing} exact />
        <Route path={`${match.url}/update`} component={MeUpdate} exact />
        <Route path={`${match.url}/update/hobbies`} component={UpdateHobbies} exact />
        <Route path={`${match.url}/recommend`} render={() => <Redirect to={`${match.url}/recommend/groups`} />} exact />
        <Route path={`${match.url}/recommend/groups`} component={RecommendGroups} exact />
      </Suspense>
    </IonRouterOutlet>
  )
}

export default MeRoute;