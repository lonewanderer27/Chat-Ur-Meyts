import { FC, useEffect, useRef } from 'react';
import {
  IonModal,
  IonContent,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonList,
  IonItem,
  IonToggle,
  IonIcon
} from '@ionic/react';
import { useToggleTheme } from '../hooks/useToggleTheme';
import { closeOutline } from 'ionicons/icons';

const AccessibilitySettings: FC = () => {
  const [darkMode, toggleDarkMode] = useToggleTheme('darkModeActivated', 'ion-palette-dark');
  const [highContrastMode, toggleHighContrastMode] = useToggleTheme('highContrastModeActivated', 'ion-palette-high-contrast');
  const [increaseFontMode, toggleFontMode] = useToggleTheme('increaseFontModeActivated', 'fontSize20');
  const modal = useRef<HTMLIonModalElement>(null);

  const dismiss = () => {
    modal.current?.dismiss();
  };

  useEffect(() => {
    // For DaisyUI
    if (darkMode) {
      document.documentElement.dataset.theme = 'dark';
    } else {
      document.documentElement.dataset.theme = 'light';
    }
  }, [darkMode])

  return (
    <IonModal initialBreakpoint={0.3} breakpoints={[0, 0.3]} id="settings-modal" ref={modal} trigger="open-modal">
      <IonContent>
        <IonToolbar>
          <IonTitle className='mt-1'>Accessibility</IonTitle>
          <IonButtons slot="end">
            <IonButton color="dark" onClick={() => dismiss()}>
              <IonIcon src={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonList>
          <IonItem>
            <IonToggle checked={darkMode} onIonChange={toggleDarkMode} justify="space-between">
              Dark Mode
            </IonToggle>
          </IonItem>

          <IonItem>
            <IonToggle mode="ios" checked={highContrastMode} onIonChange={toggleHighContrastMode} justify="space-between">
              High Contrast
            </IonToggle>
          </IonItem>

          <IonItem>
            <IonToggle checked={increaseFontMode} onIonChange={toggleFontMode} justify="space-between">
              Large Text
            </IonToggle>
          </IonItem>
        </IonList>
      </IonContent>
    </IonModal>
  );
};

export default AccessibilitySettings;
