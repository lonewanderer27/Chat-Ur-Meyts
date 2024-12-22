import { IonRouterOutlet } from "@ionic/react";
import { FC } from "react";
import { Route, RouteComponentProps } from "react-router";
import StudentPage from "../pages/Student/StudentPage";
import StudentFollowing from "../pages/Student/StudentFollowing";
import StudentGroups from "../pages/Student/StudentGroups";

const StudentRoute: FC<RouteComponentProps> = ({ match }) => {
  console.log(match);

  return (
    <IonRouterOutlet id="student">
      <Route 
        path={`${match.url}/id/:student_id`}
        component={StudentPage} exact />
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
    </IonRouterOutlet>
  )
}

export default StudentRoute;