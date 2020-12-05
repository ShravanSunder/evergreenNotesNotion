import React, { SyntheticEvent } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { sidebarExtensionSelector } from 'aNotion/providers/storeSelectors';
import { sidebarExtensionActions } from 'aNotion/components/layout/sidebarExtensionSlice';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import {
   FindInPageTwoTone,
   BookTwoTone,
   RefreshTwoTone,
   SettingsTwoTone,
   FontDownloadTwoTone,
   TocTwoTone,
} from '@material-ui/icons/';
import { lightGreen } from '@material-ui/core/colors';
import {
   Grid,
   Typography,
   IconButton,
   createStyles,
   makeStyles,
   Theme,
} from '@material-ui/core';
import { LightTooltip } from 'aNotion/components/common/Styles';
import { updateStatus } from 'aNotion/types/updateStatus';
import { flushCache } from 'aUtilities/apiCache';
import { contentActions } from '../contents/contentSlice';
import { NavigationState } from './SidebarExtensionState';

export enum LayoutTabs {
   References = 'References',
   Search = 'Search',
   PageMarkups = 'Page Markups',
   TOC = 'Table Of Contents',
   Events = 'Events',
   Mentions = 'Mentions',
   Settings = 'Settings',
}

export const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      grouped: {
         margin: theme.spacing(0.5),
         border: 'none',
         '&:not(:first-child)': {
            borderRadius: theme.shape.borderRadius,
         },
         '&:first-child': {
            borderRadius: theme.shape.borderRadius,
         },
      },
      toggleButton: {
         color: lightGreen[800],
         backgroundColor: lightGreen[50],
         '&$checked': {
            color: lightGreen[800],
            backgroundColor: lightGreen[200],
         },
      },
   })
);

export const refreshSidebarContents = (
   dispatch: any,
   navigation: NavigationState
) => {
   console.log('...received refreshSidebarContents updateevergreensidebar');
   if (navigation.pageId != null) {
      flushCache();
      dispatch(contentActions.clearContent());

      dispatch(
         sidebarExtensionActions.fetchCurrentNotionPage({
            pageId: navigation.pageId,
         })
      );
   }
};

export const LayoutMenuBar = ({
   tab,
   setTab,
}: {
   tab: LayoutTabs;
   setTab: React.Dispatch<React.SetStateAction<LayoutTabs>>;
}) => {
   const classes = useStyles();

   const dispatch = useDispatch();
   const sidebar = useSelector(sidebarExtensionSelector, shallowEqual);

   const handleTab = (
      event: React.MouseEvent<HTMLElement>,
      newTab: LayoutTabs | null
   ) => {
      if (newTab != null) {
         setTab(newTab);
      }
   };

   const handleRefresh = (e: SyntheticEvent) => {
      dispatch(
         sidebarExtensionActions.setUpdateReferenceStatus(updateStatus.waiting)
      );
      dispatch(
         sidebarExtensionActions.setUpdateMarksStatus(updateStatus.waiting)
      );
      refreshSidebarContents(dispatch, sidebar.navigation);
   };

   return (
      <>
         <div
            style={{
               backgroundColor: lightGreen[100],
               borderRadius: 9,
               padding: 6,
               boxShadow:
                  '2px 2px 6px #dcedc8, -2px 2px 6px #dcedc8, 2px -2px 6px #dcedc8, -2px -2px 6px #dcedc8',
            }}>
            <Grid container justify="flex-start">
               <Grid xs={1} item>
                  <div style={{ marginTop: 11 }}>
                     <LightTooltip
                        title="Refresh Notion Page Information"
                        placement="top">
                        <IconButton size="small" onClick={handleRefresh}>
                           <RefreshTwoTone />
                        </IconButton>
                     </LightTooltip>
                  </div>
               </Grid>
               <Grid xs item container spacing={1} justify="center">
                  <Grid item>
                     <ToggleButtonGroup
                        className={classes.grouped}
                        size="small"
                        value={tab}
                        exclusive
                        onChange={handleTab}>
                        <ToggleButton
                           value={LayoutTabs.References}
                           className={classes.toggleButton}>
                           <BookTwoTone></BookTwoTone>
                        </ToggleButton>
                        <ToggleButton
                           value={LayoutTabs.PageMarkups}
                           className={classes.toggleButton}>
                           <FontDownloadTwoTone></FontDownloadTwoTone>
                        </ToggleButton>
                        <ToggleButton
                           value={LayoutTabs.TOC}
                           className={classes.toggleButton}>
                           <TocTwoTone></TocTwoTone>
                        </ToggleButton>
                        <ToggleButton
                           value={LayoutTabs.Search}
                           className={classes.toggleButton}>
                           <FindInPageTwoTone></FindInPageTwoTone>
                        </ToggleButton>
                        <ToggleButton
                           value={LayoutTabs.Settings}
                           className={classes.toggleButton}>
                           <SettingsTwoTone></SettingsTwoTone>
                        </ToggleButton>
                     </ToggleButtonGroup>
                  </Grid>
               </Grid>
               <Grid xs={1} item></Grid>
            </Grid>

            <Grid container spacing={1} justify="center">
               <Grid item>
                  <Typography
                     variant="h4"
                     style={{
                        marginTop: 8,
                        marginBottom: 4,
                        fontVariant: 'small-caps',
                     }}>
                     <strong>{tab}</strong>
                  </Typography>
               </Grid>
            </Grid>
         </div>
      </>
   );
};
