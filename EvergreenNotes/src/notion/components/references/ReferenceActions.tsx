import React, { SyntheticEvent } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Button, Grid, IconButton } from '@material-ui/core';
import { LinkOutlined } from '@material-ui/icons';
import { sidebarExtensionSelector } from 'aNotion/providers/storeSelectors';
import { Launch, FileCopyOutlined, WidgetsTwoTone } from '@material-ui/icons';
import { copyToClipboard } from 'aCommon/extensionHelpers';
import { LightTooltip } from '../common/Styles';
import { useSnackbar } from 'notistack';
import { useReferenceStyles } from './AccordionStyles';
import { SearchRecordModel } from 'aNotion/models/SearchRecord';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';

export const ReferenceActions = ({
   id,
   text,
   path,
}: {
   id: string;
   text: string;
   path: NotionBlockModel[];
}) => {
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
   const handleCopyLink = (e: SyntheticEvent) => {
      e.stopPropagation();
      let page = path.slice(-1).pop();
      if (sidebar.navigation.notionSite != null && page?.blockId != null) {
         let url =
            sidebar.navigation.notionSite +
            page.blockId.replace(/-/g, '') +
            '#' +
            id.replace(/-/g, '');
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
      let page = path.slice(-1).pop();
      if (sidebar.navigation.notionSite != null && page?.blockId != null) {
         let url =
            sidebar.navigation.notionSite +
            page.blockId.replace(/-/g, '') +
            '#' +
            id.replace(/-/g, '');

         enqueueSnackbar('Opening page in new tab', { variant: 'info' });
         window.open(url);
      }
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
                     className={classes.button}
                     size="small"
                     color="secondary"
                     variant="outlined"
                     onClick={handleEmbedBlock}
                     startIcon={<WidgetsTwoTone />}>
                     embed block
                  </Button>
               </LightTooltip>
            </Grid>
         </Grid>
         <Grid xs item container justify="flex-end">
            <Grid item>
               <LightTooltip title="Copy link" placement="bottom">
                  <IconButton
                     className={classes.button}
                     color="secondary"
                     size="small"
                     onMouseDown={handleCopyLink}>
                     <LinkOutlined></LinkOutlined>
                  </IconButton>
               </LightTooltip>
            </Grid>
            <Grid item>
               <LightTooltip title="Copy text" placement="bottom">
                  <IconButton
                     className={classes.button}
                     size="small"
                     color="secondary"
                     onClick={handleCopyText}>
                     <FileCopyOutlined />
                  </IconButton>
               </LightTooltip>
            </Grid>
            <Grid item>
               <LightTooltip title="Open page in a new tab" placement="bottom">
                  <IconButton
                     className={classes.button}
                     color="secondary"
                     size="small"
                     onMouseDown={handleNewTabPreventMiddelScroll}
                     onMouseUp={handleNewTabMiddleClick}>
                     <Launch></Launch>
                  </IconButton>
               </LightTooltip>
            </Grid>
         </Grid>
      </Grid>
   );
};
