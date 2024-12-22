import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonToolbar } from '@ionic/react'
import { notificationsOutline, searchOutline, personCircleOutline } from 'ionicons/icons'

import NavBtn from '../components/NavBtn'
import Sidebar from '../components/Sidebar'
import useHideTabs from '../hooks/useHideTabs'
import useSelfStudentLite from '../hooks/student/useSelfStudentLite'

export default function Community() {
  const { student } = useSelfStudentLite();
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
