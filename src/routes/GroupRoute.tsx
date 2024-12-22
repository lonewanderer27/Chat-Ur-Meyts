import { IonRouterOutlet } from '@ionic/react'
import React from 'react'
import { Route, RouteComponentProps } from 'react-router'
import GroupInfo from '../pages/Group/GroupInfo'
import GroupPostPage from '../pages/Group/GroupPostPage'
import GroupResources from '../pages/Group/GroupResources'
import GroupTimeline from '../pages/Group/GroupTimeline'
import GroupAwaitingApproval from '../pages/Group/Members/GroupAwaitingApproval'
import GroupMembers from '../pages/Group/Members/GroupMembers'
import GroupPendingMembers from '../pages/Group/Members/GroupPendingMembers'
import GroupRouteCreate from './GroupRouteCreate'
import GroupCreateNewPost from '../pages/Group/GroupCreateNewPost'

const GroupRoute: React.FC<RouteComponentProps> = ({ match }) => {
  return (
    <IonRouterOutlet id="group">
      <Route path={`${match.url}/create`} component={GroupRouteCreate} />
      <Route
        path={`${match.url}/id/:group_id`}
        component={GroupTimeline}
        exact
      />
      <Route
        path={`${match.url}/vu/:vanity_url`}
        component={GroupTimeline}
        exact
      />
      <Route
        path={`${match.url}/vu/:vanity_url/awaiting_approval`}
        component={GroupAwaitingApproval}
        exact
      />
      <Route
        path={`${match.url}/vu/:vanity_url/post/:post_id`}
        component={GroupPostPage}
        exact
      />
      <Route
        path={`${match.url}/vu/:vanity_url/members`}
        component={GroupMembers}
        exact
      />
      <Route
        path={`${match.url}/vu/:vanity_url/members/pending`}
        component={GroupPendingMembers}
        exact
      />
      <Route
        path={`${match.url}/vu/:vanity_url/resources`}
        component={GroupResources}
        exact
      />
      <Route
        path={`${match.url}/vu/:vanity_url/info`}
        component={GroupInfo}
        exact
      />
      <Route
        path={`${match.url}/vu/:vanity_url/new-post`}
        component={GroupCreateNewPost}
        exact
      />
      {/* <Route
        path={`${match.url}/group/vu/:vanity_url/info/edit`}
        component={GroupEditInfo}
        exact
      /> */}
    </IonRouterOutlet>
  )
}

export default GroupRoute