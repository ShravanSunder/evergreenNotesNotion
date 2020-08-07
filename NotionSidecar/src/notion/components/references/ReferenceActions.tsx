import React, { SyntheticEvent } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Button, Grid, IconButton } from '@material-ui/core';
import { RefData } from './referenceTypes';
import { LinkOutlined } from '@material-ui/icons';
import { navigationSelector } from 'aNotion/providers/storeSelectors';
import { Launch, FileCopyOutlined, WidgetsTwoTone } from '@material-ui/icons';
import { copyToClipboard } from 'aCommon/extensionHelpers';
import { LightTooltip } from '../Styles';
import { useSnackbar } from 'notistack';
import { useReferenceStyles } from './Reference';
import { BlockUi } from '../blocks/BlockUi';

export const ReferenceActions = ({ refData }: { refData: RefData }) => {
   const navigation = useSelector(navigationSelector, shallowEqual);
   const { enqueueSnackbar } = useSnackbar();

   let classes = useReferenceStyles();

   const handleEmbedBlock = (e: SyntheticEvent) => {
      e.stopPropagation();
      if (navigation.notionSite != null) {
         let url =
            navigation.notionSite + refData.searchRecord.id.replace(/-/g, '');
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
      let page = refData.searchRecord.path.slice(-1).pop();
      if (navigation.notionSite != null && page?.blockId != null) {
         let url =
            navigation.notionSite +
            page.blockId.replace(/-/g, '') +
            '#' +
            refData.searchRecord.id.replace(/-/g, '');
         let success = copyToClipboard(url);
         if (success) {
            enqueueSnackbar('Copied link to clipboard', { variant: 'info' });
         }
      }
   };

   const handleCopyText = (e: SyntheticEvent) => {
      e.stopPropagation();
      let text = refData.searchRecord.text;
      if (navigation.notionSite != null && text != null) {
         let success = copyToClipboard(text);
         if (success) {
            enqueueSnackbar('Copied text to clipboard', { variant: 'info' });
         }
      }
   };

   const handleNewTabMiddleClick = (e: SyntheticEvent) => {
      //e.stopPropagation();
      e.preventDefault();
      if (navigation.notionSite != null) {
         let url =
            navigation.notionSite + refData.searchRecord.id.replace('-', '');
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
               <LightTooltip title="Open in a new tab" placement="bottom">
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
