import { IonAvatar, IonCard, IonGrid, IonIcon, IonRow, IonText, useIonRouter } from '@ionic/react'

import GroupMembersBadge from './GroupMembersBadge';
import { peopleCircleOutline } from 'ionicons/icons';
import useValidUrl from '../../hooks/useValidURL';

interface GroupCardProps {
  name: string;
  avatar_url: string;
  vanity_id: string;
  members: { avatar_url?: string }[];
  cover_url?: string;
  icon?: string;
}

NewGroupCard.defaultProps = {
  icon: peopleCircleOutline
}

function NewGroupCard(props: GroupCardProps) {
  const rt = useIonRouter();
  const isPhotoValid = useValidUrl(props.avatar_url);
  function handleView() {
    rt.push("/group/vu/"+props.vanity_id)
  }
  return (
    <IonCard
      className='cursor-pointer ion-no-margin w-full font-poppins'
      onClick={handleView} 
      style={{
        backgroundImage: `url(${props.cover_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minWidth: '200px',
      }}>
      <IonGrid className='ion-padding'>
        <IonRow>
          <IonAvatar>
            {props.avatar_url && isPhotoValid ? (
              <img className='h-auto w-[50px] shadow-md' src={props.avatar_url} />
            ) : (
              <IonIcon className='text-[50px] shadow-md' src={props.icon}></IonIcon>
            )}
          </IonAvatar>
        </IonRow>
        <IonRow className='ion-margin-vertical'>
          <IonText className={`${props.avatar_url ? "text-white" : ""} text-ellipsis shadow-md font-medium text-lg font-poppins truncate`}>
            <p>{props.name}</p>
          </IonText>
        </IonRow>
        <IonRow>
          {props.members && <GroupMembersBadge members={props.members} avatar_url />}
        </IonRow>
      </IonGrid>
    </IonCard>
  )
}

export default NewGroupCard