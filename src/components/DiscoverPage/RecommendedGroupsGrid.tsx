import React from 'react'
import useSelfRecommendedGroups from '../../hooks/me/useSelfRecommendedGroups';
import { IonGrid, IonRow, IonCol, IonText, IonSkeletonText } from '@ionic/react';
import GroupCardLoader from '../../loaders/GroupCardLoader';
import RecommendedGroupCard from '../RecommendedGroupCard';
import AddGroupCard from './AddGroupCard';

const RecommendedGroupsGrid = () => {
  const { query, groups } = useSelfRecommendedGroups();
  // console.log("recommended groups:\n", groups);

  return (
    <IonGrid className="ion-padding-vertical mx-[-4px]">
      <IonRow>
        <IonCol size="12">
          {query.isFetching && (
            <IonSkeletonText animated className="h-5 w-56 rounded-md" />
          )}
          {query.data && query.data?.length > 0 && !query.isFetching && (
            <IonText className="text-xl font-bold font-poppins">
              For You
            </IonText>
          )}
        </IonCol>
      </IonRow>
      <IonRow className="mx-[-4px]">
        <IonCol size="12">
          <IonRow>
            {(query.data && !query.isFetching) ? (
                groups!.map((group, i) => (
                <RecommendedGroupCard
                  key={group.vanity_id + i}
                  // @ts-ignore
                  group={group}
                />
              ))
            ) : (
              Array.from({ length: 6 }).map((_, i) => (
                <GroupCardLoader key={i} />
              ))
            )}
            <AddGroupCard />
          </IonRow>
        </IonCol>
      </IonRow>
    </IonGrid>
  )
}

export default RecommendedGroupsGrid