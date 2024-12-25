import { Route, RouteComponentProps } from "react-router";
import Discover from "../pages/Discover";
import { FC, lazy, Suspense } from "react";
import Inbox from "../pages/Inbox";
import { IonRouterOutlet } from "@ionic/react";
import DefaultFallback from "../fallbacks";
const SearchPage = lazy(() => import("../pages/Search"));

const DiscoverRoute: FC<RouteComponentProps> = ({ match }) => {
  console.log(match);

  return (
    <IonRouterOutlet id="discover">
      <Suspense fallback={<DefaultFallback />}>
        <Route path={match.url} component={Discover} exact />
        <Route path={`${match.url}/search`} component={SearchPage} />
        <Route path={`${match.url}/inbox`} component={Inbox} exact />
      </Suspense>
    </IonRouterOutlet>
  );
};

export default DiscoverRoute;
