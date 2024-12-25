import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle } from '@ionic/react'
import RecentSearchItem from './RecentSearchItem';
import { SearchHistoryType } from '../../types'
import RecentSearchItemLoader from '../../loaders/RecentSearchItemLoader';
import useSelfStudentLite from '../../hooks/me/useSelfStudentLite';

const RecentSearches = (props: {
  searchHistory?: SearchHistoryType[];
  isLoading?: boolean;
}) => {
  const { student } = useSelfStudentLite();

  if (props.searchHistory?.length === 0) {
    return <></>
  }

  if (!student) {
    return <></>
  }

  return (
    <IonCard color="light" className='mx-[-20px] shadow-none rounded-2xl mt-[-50]'>
      <IonCardHeader>
        <IonCardSubtitle>Recent Searches</IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent className='px-4 my-0'>
        {!props.isLoading ? (
          props.searchHistory?.slice(0, 7).map((search, index) => (
            <RecentSearchItem historyId={search.id!} key={search + "index" + index} title={search.query} />
          ))
        ) : (
          Array.from({ length: 10 }).map((_, i) => (
            <RecentSearchItemLoader key={i} />
          ))
        )}
      </IonCardContent>
    </IonCard>
  )
}

export default RecentSearches