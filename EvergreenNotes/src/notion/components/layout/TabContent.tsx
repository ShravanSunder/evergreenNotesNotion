import React, { Suspense } from 'react';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import {
   AccessIssue,
   LoadingTab,
   WaitingToLoadNotionSite,
} from 'aNotion/components/common/Loading';
import { SidebarExtensionStatus } from 'aNotion/components/layout/SidebarExtensionState';
import { calculateSidebarStatus } from 'aNotion/services/notionSiteService';
import { LayoutTabs } from './LayoutMenuBar';
import { ReferencesPane, MarksPane, SearchPane, OptionsPane } from './Layout';

interface ITabContent {
   debouncedStatus: SidebarExtensionStatus;
   tabsWithoutSiteLoading: boolean;
   tab: LayoutTabs;
}
export const TabContent = ({
   debouncedStatus,
   tabsWithoutSiteLoading,
   tab,
}: ITabContent) => {
   return (
      <>
         <Suspense fallback={<AccessIssue />}>
            {debouncedStatus.webpageStatus === thunkStatus.idle && (
               <WaitingToLoadNotionSite />
            )}
            {debouncedStatus.webpageStatus === thunkStatus.rejected && (
               <AccessIssue />
            )}
            {calculateSidebarStatus(debouncedStatus) === thunkStatus.pending &&
               !tabsWithoutSiteLoading && <LoadingTab />}
         </Suspense>
         <Suspense fallback={<LoadingTab />}>
            {(calculateSidebarStatus(debouncedStatus) ||
               tabsWithoutSiteLoading) && (
               <TabContentComponents tab={tab}></TabContentComponents>
            )}
         </Suspense>
      </>
   );
};
const TabContentComponents = ({ tab }: { tab: LayoutTabs }) => {
   return (
      <>
         <div
            style={{
               display: tab === LayoutTabs.References ? 'block' : 'none',
            }}>
            <ReferencesPane />
         </div>
         <div
            style={{
               display: tab === LayoutTabs.PageMarkups ? 'block' : 'none',
            }}>
            <MarksPane />
         </div>
         <div
            style={{
               display: tab === LayoutTabs.Search ? 'block' : 'none',
            }}>
            <SearchPane />
         </div>
         {tab === LayoutTabs.Events && <div>not implemented</div>}
         {tab === LayoutTabs.Settings && <OptionsPane />}
      </>
   );
};
