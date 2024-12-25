import React, { lazy } from 'react'
import { Route, RouteComponentProps } from 'react-router'
const ContinuePage = lazy(() => import('../pages/Continue'))
import { IonRouterOutlet } from '@ionic/react'
const OTP_2_Continue = lazy(() => import('../pages/Continue/OTP_2_Continue'))
import useHideTabs from '../hooks/useHideTabs'
import { Suspense } from 'react'
import DefaultFallback from '../fallbacks'

const ContinueRoute: React.FC<RouteComponentProps> = ({ match }) => {
  useHideTabs();

  return (
    <IonRouterOutlet id="continue">
      <Suspense fallback={<DefaultFallback />}>
        <Route path={match.url} component={ContinuePage} exact />
        <Route path={`${match.url}/email/otp`} component={OTP_2_Continue} exact />
      </Suspense>
    </IonRouterOutlet>
  )
}

export default ContinueRoute