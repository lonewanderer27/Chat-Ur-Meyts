import { Route, RouteComponentProps } from "react-router";
import Discover from "../pages/Discover";
import { FC } from "react";
import Inbox from "../pages/Inbox";
import { IonRouterOutlet } from "@ionic/react";
import SearchPage from "../pages/Search";

const DiscoverRoute: FC<RouteComponentProps> = ({ match }) => {
  console.log(match);

  return (
    <IonRouterOutlet id="discover">
      <Route path={match.url} component={Discover} exact />
      <Route path={`${match.url}/search`} component={SearchPage} />
      <Route path={`${match.url}/inbox`} component={Inbox} exact />
    </IonRouterOutlet>
  );
};

export default DiscoverRoute;
