import { IonButtons, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonToolbar } from '@ionic/react'
import { notificationsOutline, personOutline, searchOutline, accessibilityOutline, personCircleOutline } from 'ionicons/icons'

import NavBtn from '../components/NavBtn'
import Sidebar from '../components/Sidebar'
import { showTabBar } from '../utils/TabBar'
import useSelfStudent from '../hooks/student'
import useSession from '../hooks/auth/useSession'
import useHideTabs from '../hooks/useHideTabs'

export default function Community() {
  const { student } = useSelfStudent();
  useHideTabs();

  return (
    <>
      <Sidebar />
      <IonPage id="community-page">
        <IonContent className='ion-padding'>
          <IonHeader collapse='condense'>
            <IonToolbar>
              <IonButtons slot="start">
                <IonMenuButton></IonMenuButton>
              </IonButtons>
              <IonButtons slot="end">
                <NavBtn
                  route="/me"
                  avatarUrl={student?.avatar_url}
                  icon={personCircleOutline}
                />
                <NavBtn
                  route="community/search"
                  icon={searchOutline}
                />
                <NavBtn
                  route="community/inbox"
                  icon={notificationsOutline}
                />
              </IonButtons>

              
            </IonToolbar>
          </IonHeader>
        </IonContent>
      </IonPage >
    </>
  )
}
