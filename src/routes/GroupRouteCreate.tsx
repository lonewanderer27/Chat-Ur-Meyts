import { IonRouterOutlet } from '@ionic/react'
import React, { Suspense, lazy } from 'react'
import { Redirect, Route, RouteComponentProps } from 'react-router'
const CreateGroupP1 = lazy(() => import('../pages/Group/Create/CreateGroupP1'))
const CreateGroupP2 = lazy(() => import('../pages/Group/Create/CreateGroupP2'))
const CreateGroupP3 = lazy(() => import('../pages/Group/Create/CreateGroupP3'))

const GroupRouteCreate: React.FC<RouteComponentProps> = ({ match }) => {
  return (
    <IonRouterOutlet id="create-group">
      <Suspense>
        <Route
          path={`${match.url}`}
          render={() => <Redirect to={`${match.url}/p1`} />}
          exact
        />
        <Route
          path={`${match.url}/p1`}
          component={CreateGroupP1}
          exact
        />
        <Route
          path={`${match.url}/p2`}
          component={CreateGroupP2}
          exact
        />
        <Route
          path={`${match.url}/p3`}
          component={CreateGroupP3}
          exact
        />
      </Suspense>
    </IonRouterOutlet>
  )
}

export default GroupRouteCreate