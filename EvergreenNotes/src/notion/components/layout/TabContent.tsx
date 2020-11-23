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

export const ReferencesPane = React.lazy(
   () => import('aNotion/components/references/ReferencesPane')
);
export const MarksPane = React.lazy(
   () => import('aNotion/components/pageMarks/MarksPane')
);
export const SearchPane = React.lazy(
   () => import('aNotion/components/references/SearchPane')
);
export const OptionsPane = React.lazy(
   () => import('aNotion/components/options/OptionsPane')
);
export const TableOfContentsPane = React.lazy(
   () => import('aNotion/components/pageMarks/TocPane')
);

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
            {debouncedStatus.notionWebpageLoadingStatus ===
               thunkStatus.idle && <WaitingToLoadNotionSite />}
            {debouncedStatus.notionWebpageLoadingStatus ===
               thunkStatus.rejected && <AccessIssue />}
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
               display: tab === LayoutTabs.TOC ? 'block' : 'none',
            }}>
            <TableOfContentsPane />
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
