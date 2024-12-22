import { IonRouterOutlet } from "@ionic/react";
import { FC } from "react";
import { Redirect, Route, RouteComponentProps } from "react-router";
import Me from "../pages/Me";
import MeFollowing from "../pages/Me/MeFollowing";
import MeGroups from "../pages/Me/MeGroups";
import MeUpdate from "../pages/Me/MeUpdate";
import UpdateHobbies from "../pages/Me/MeUpdate/UpdateHobbies";
import RecommendGroups from "../pages/Recommend/RecommendGroups";

const MeRoute: FC<RouteComponentProps> = ({ match }) => {
  console.log(match);

  return (
    <IonRouterOutlet id="me">
      <Route path={match.url} component={Me} exact />
      <Route path={`${match.url}/groups`} component={MeGroups} exact />
      <Route path={`${match.url}/following`} component={MeFollowing} exact />
      <Route path={`${match.url}/update`} component={MeUpdate} exact />
      <Route path={`${match.url}/update/hobbies`} component={UpdateHobbies} exact />
      <Route path={`${match.url}/recommend`} render={() => <Redirect to={`${match.url}/recommend/groups`} />} exact />
      <Route path={`${match.url}/recommend/groups`} component={RecommendGroups} exact />
    </IonRouterOutlet>
  )
}

export default MeRoute;