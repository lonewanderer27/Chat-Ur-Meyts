import { IonRouterOutlet } from '@ionic/react'
import React, { Suspense } from 'react'
import { Route, RouteComponentProps } from 'react-router'
const FeatureUnavailable = React.lazy(() => import('./FeatureUnavailable'))
import DefaultFallback from '../fallbacks'

const ThreadsRoute: React.FC<RouteComponentProps> = ({ match }) => {
  console.log(match);

  return (
    <IonRouterOutlet id="threads">
      <Suspense fallback={<DefaultFallback />}>
        <Route path={match.url} component={FeatureUnavailable} exact />
      </Suspense>
    </IonRouterOutlet>
  )
}

export default ThreadsRoute;
