import { IonRouterOutlet } from "@ionic/react";
import { FC, Suspense, lazy } from "react";
import { Route, RouteComponentProps } from "react-router";
const StudentPage = lazy(() => import("../pages/Student/StudentPage"));
const StudentFollowing = lazy(() => import("../pages/Student/StudentFollowing"));
const StudentGroups = lazy(() => import("../pages/Student/StudentGroups"));

const StudentRoute: FC<RouteComponentProps> = ({ match }) => {
  console.log(match);
  return (
    <IonRouterOutlet id="student">
      <Suspense>
        <Route
          path={`${match.url}/id/:student_id`}
          component={StudentPage}
          exact
        />
        <Route
          path={`${match.url}/id/:student_id/following`}
          component={StudentFollowing}
          exact
        />
        <Route
          path={`${match.url}/id/:student_id/groups`}
          component={StudentGroups}
          exact
        />
      </Suspense>
    </IonRouterOutlet>
  )
}

export default StudentRoute;