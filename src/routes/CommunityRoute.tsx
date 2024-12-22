import { IonRouterOutlet } from "@ionic/react";
import React from "react";
import { Route, RouteComponentProps } from "react-router";

import Community from "../pages/Community";
import Inbox from "../pages/Inbox";
import SearchPage from "../pages/Search";

const CommunityRoute: React.FC<RouteComponentProps> = ({ match }) => {
  console.log(match);

  return (
    <IonRouterOutlet id="community">
      <Route path={match.url} component={Community} exact />
      {/* <Route
        path={`${match.url}/group/create`}
        render={() => <Redirect to={`${match.url}/groups/create/p1`} />}
        exact
      /> */}
      {/* <Route
        path={`${match.url}/group/create/p1`}
        component={CreateGroupP1}
        exact
      />
      <Route
        path={`${match.url}/group/create/p2`}
        component={CreateGroupP2}
        exact
      />
      <Route
        path={`${match.url}/group/create/p3`}
        component={CreateGroupP3}
        exact
      /> */}
      {/* <Route
        path={`${match.url}/group/id/:group_id`}
        component={GroupTimeline}
        exact
      />
      <Route
        path={`${match.url}/group/vu/:vanity_url`}
        component={GroupTimeline}
        exact
      />
      <Route
        path={`${match.url}/group/vu/:vanity_url/awaiting_approval`}
        component={GroupAwaitingApproval}
        exact
      />
      <Route
        path={`${match.url}/group/vu/:vanity_url/post/:post_id`}
        component={GroupPostPage}
        exact
      />
      <Route
        path={`${match.url}/group/vu/:vanity_url/members`}
        component={GroupMembers}
        exact
      />
      <Route
        path={`${match.url}/group/vu/:vanity_url/members/pending`}
        component={GroupPendingMembers}
        exact
      />
      <Route
        path={`${match.url}/group/vu/:vanity_url/resources`}
        component={GroupResources}
        exact
      />
      <Route
        path={`${match.url}/group/vu/:vanity_url/info`}
        component={GroupInfo}
        exact
      />
      {/* <Route
        path={`${match.url}/group/vu/:vanity_url/info/edit`}
        component={GroupEditInfo}
        exact
      /> */}
      <Route path={`${match.url}/search`} component={SearchPage} exact />
      <Route path={`${match.url}/inbox`} component={Inbox} exact />
    </IonRouterOutlet>
  );
};

export default CommunityRoute;
