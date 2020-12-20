import React, { SyntheticEvent } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Button, Grid, IconButton } from '@material-ui/core';
import { LinkOutlined } from '@material-ui/icons';
import { sidebarExtensionSelector } from 'aNotion/providers/storeSelectors';
import { Launch, FileCopyOutlined, WidgetsTwoTone } from '@material-ui/icons';
import { copyToClipboard, isGuid } from 'aCommon/extensionHelpers';
import { LightTooltip } from '../common/TooltipStyles';
import { useSnackbar } from 'notistack';
import { useReferenceStyles } from './referenceStyles';
import { INotionBlockModel } from 'aNotion/models/NotionBlock';
import { SidebarExtensionState } from '../layout/SidebarExtensionState';
import {
   EvergreenMessagingEnum,
   TEvergreenMessage,
} from 'aSidebar/sidebarMessaging';
import VerticalAlignBottomIcon from '@material-ui/icons/VerticalAlignBottom';
import CropFreeOutlinedIcon from '@material-ui/icons/CropFreeOutlined';
import CenterFocusStrongIcon from '@material-ui/icons/CenterFocusStrong';

interface IReferenceActionParams {
   id: string;
   text: string | undefined;
   path: INotionBlockModel[];
   mentionSourceId?: string;
   handleMarkupFocus?: () => void;
   markupFocusState?: boolean;
}

export const ReferenceActions = ({
   id,
   text,
   path,
   mentionSourceId = undefined,
   handleMarkupFocus = undefined,
   markupFocusState = false,
}: IReferenceActionParams) => {
   const sidebar = useSelector(sidebarExtensionSelector, shallowEqual);
   const { enqueueSnackbar } = useSnackbar();

   let classes = useReferenceStyles();

   const handleEmbedBlock = (e: SyntheticEvent) => {
      e.stopPropagation();
      if (sidebar.navigation.notionSite != null) {
         let url = sidebar.navigation.notionSite + id.replace(/-/g, '');
         let success = copyToClipboard(url);
         console.log('copied to clipboard');
         if (success) {
            console.log('copied to clipboard');
            enqueueSnackbar('Copied embed block', { variant: 'info' });
         }
      }
   };

   const handleMentionSourceIdClick = (e: SyntheticEvent) => {
      e.stopPropagation();

      if (mentionSourceId != null && isGuid(mentionSourceId)) {
         const msg: TEvergreenMessage<string> = {
            payload: mentionSourceId,
            type: EvergreenMessagingEnum.navigateToBlock,
         };
         window.parent.postMessage(msg, '*');
      }
   };

   const handleCopyLink = (e: SyntheticEvent) => {
      e.stopPropagation();
      let page = path.slice(-1).pop();
      const url = getNotionUrl(path, sidebar, id);
      if (url != null) {
         let success = copyToClipboard(url);
         if (success) {
            enqueueSnackbar('Copied link to clipboard', { variant: 'info' });
         }
      }
   };

   const handleCopyText = (e: SyntheticEvent) => {
      e.stopPropagation();
      if (sidebar.navigation.notionSite != null && text != null) {
         let success = copyToClipboard(text);
         if (success) {
            enqueueSnackbar('Copied text to clipboard', { variant: 'info' });
         }
      }
   };

   const handleNewTabMiddleClick = (e: SyntheticEvent) => {
      //e.stopPropagation();
      e.preventDefault();
      const url = getNotionUrl(path, sidebar, id);
      enqueueSnackbar('Opening page in new tab', { variant: 'info' });
      window.open(url);
      return false;
   };

   const handleNewTabPreventMiddelScroll = (e: SyntheticEvent) => {
      e.preventDefault();
      return false;
   };

   return (
      <Grid container spacing={1} justify="space-between">
         <Grid xs item container justify="flex-start">
            <Grid item>
               <LightTooltip
                  title="Copy a global embed block link"
                  placement="bottom">
                  <Button
                     className={classes.actionButton}
                     size="small"
                     variant="outlined"
                     onClick={handleEmbedBlock}
                     startIcon={<WidgetsTwoTone />}>
                     embed
                  </Button>
               </LightTooltip>
            </Grid>
         </Grid>
         <Grid xs item container justify="flex-end">
            {handleMarkupFocus != null && (
               <Grid item>
                  <LightTooltip title="Focus view" placement="bottom">
                     <IconButton
                        className={classes.actionButton}
                        size="small"
                        onClick={() => handleMarkupFocus()}>
                        {markupFocusState && (
                           <CenterFocusStrongIcon
                              className={
                                 classes.actionButtonIcon
                              }></CenterFocusStrongIcon>
                        )}
                        {!markupFocusState && (
                           <CropFreeOutlinedIcon
                              className={
                                 classes.actionButtonIcon
                              }></CropFreeOutlinedIcon>
                        )}
                     </IconButton>
                  </LightTooltip>
               </Grid>
            )}
            <Grid item>
               <LightTooltip title="Copy link" placement="bottom">
                  <IconButton
                     className={classes.actionButton}
                     size="small"
                     onMouseDown={handleCopyLink}>
                     <LinkOutlined
                        className={classes.actionButtonIcon}></LinkOutlined>
                  </IconButton>
               </LightTooltip>
            </Grid>
            {text != null && (
               <Grid item>
                  <LightTooltip title="Copy text" placement="bottom">
                     <IconButton
                        className={classes.actionButton}
                        size="small"
                        onClick={handleCopyText}>
                        <FileCopyOutlined
                           className={classes.actionButtonIcon}
                        />
                     </IconButton>
                  </LightTooltip>
               </Grid>
            )}
            <Grid item>
               <LightTooltip title="Open page in a new tab" placement="bottom">
                  <IconButton
                     className={classes.actionButton}
                     size="small"
                     onMouseDown={handleNewTabPreventMiddelScroll}
                     onMouseUp={handleNewTabMiddleClick}>
                     <Launch className={classes.actionButtonIcon} />
                  </IconButton>
               </LightTooltip>
            </Grid>
            {mentionSourceId != null && (
               <Grid item>
                  <LightTooltip title="Scroll to mention" placement="bottom">
                     <IconButton
                        className={classes.actionButton}
                        size="small"
                        onClick={handleMentionSourceIdClick}>
                        <VerticalAlignBottomIcon
                           className={classes.actionButtonIcon}
                        />
                     </IconButton>
                  </LightTooltip>
               </Grid>
            )}
         </Grid>
      </Grid>
   );
};

export const getNotionUrl = (
   path: INotionBlockModel[],
   sidebar: SidebarExtensionState,
   id: string
): string | undefined => {
   let page = path.slice(-1).pop();
   if (sidebar.navigation.notionSite != null) {
      if (page?.blockId != null) {
         let pageId = page.blockId.replace(/-/g, '');

         if (page.collection != null) {
            return sidebar.navigation.notionSite + id.replace(/-/g, '');
         }
         return (
            sidebar.navigation.notionSite + pageId + '#' + id.replace(/-/g, '')
         );
      } else {
         return sidebar.navigation.notionSite + id.replace(/-/g, '');
      }
   }

   return undefined;
};
