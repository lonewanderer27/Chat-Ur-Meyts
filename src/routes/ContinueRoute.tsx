import React,{ lazy } from 'react'
import { Route, RouteComponentProps } from 'react-router'
const ContinuePage = lazy(() => import('../pages/Continue'))
import { IonRouterOutlet } from '@ionic/react'
import OTP_2_Continue from '../pages/Continue/OTP_2_Continue'
import useHideTabs from '../hooks/useHideTabs'

const ContinueRoute: React.FC<RouteComponentProps> = ({ match }) => {
  useHideTabs();

  return (
    <IonRouterOutlet id="continue">
      <Route path={match.url} component={ContinuePage} exact />
      <Route path={`${match.url}/email/otp`} component={OTP_2_Continue} exact />
    </IonRouterOutlet>
  )
}

export default ContinueRoute