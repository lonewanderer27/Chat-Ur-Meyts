import { IonRouterOutlet } from '@ionic/react'
import React from 'react'
import { Redirect, Route, RouteComponentProps } from 'react-router'
import CreateGroupP1 from '../pages/Group/Create/CreateGroupP1'
import CreateGroupP2 from '../pages/Group/Create/CreateGroupP2'
import CreateGroupP3 from '../pages/Group/Create/CreateGroupP3'

const GroupRouteCreate: React.FC<RouteComponentProps> = ({ match }) => {
  return (
    <IonRouterOutlet id="create-group">
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
    </IonRouterOutlet>
  )
}

export default GroupRouteCreate