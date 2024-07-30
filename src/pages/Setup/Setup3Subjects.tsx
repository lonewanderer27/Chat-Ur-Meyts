import { IonContent, IonPage, IonProgressBar, useIonViewWillEnter } from '@ionic/react';

import React from 'react'
import { hideTabBar } from '../../utils/TabBar';

const Setup2CourseYrLevelType = () => {
  useIonViewWillEnter(() => {
    hideTabBar();
  });

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div>
          <IonProgressBar value={0.9}></IonProgressBar>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Setup2CourseYrLevelType