import React, { SyntheticEvent } from 'react';
import { createStyles, IconButton, makeStyles } from '@material-ui/core';
import {
   UnfoldMore,
   MoreVert,
   DragIndicator,
   WidgetsTwoTone,
} from '@material-ui/icons';
import { INotionBlockModel } from 'aNotion/models/NotionBlock';
import {
   EvergreenMessagingEnum,
   TEvergreenMessage,
} from 'aSidebar/sidebarMessaging';
import { LightTooltip } from 'aNotion/components/common/TooltipStyles';
import { copyToClipboard } from 'aCommon/extensionHelpers';
import { sidebarExtensionSelector } from 'aNotion/providers/storeSelectors';
import { useSelector, shallowEqual } from 'react-redux';
import { useSnackbar } from 'notistack';

export const handleNavigateToBlockInNotion = (blockId: string) => {
   const msg: TEvergreenMessage<string> = {
      payload: blockId,
      type: EvergreenMessagingEnum.navigateToBlock,
   };
   window.parent.postMessage(msg, '*');
};

const handleCopyEmbedBlock = (
   e: SyntheticEvent,
   blockId: string,
   notionSite: string,
   successCallback?: () => void
) => {
   e.stopPropagation();
   if (notionSite != null) {
      let url = notionSite + blockId.replace(/-/g, '');
      let success = copyToClipboard(url);
      console.log('copied to clipboard');
      if (success) {
         console.log('copied to clipboard');
         if (successCallback != null) successCallback();
      }
   }
};

const useStyles = makeStyles((theme) =>
   createStyles({
      icon: {
         maxHeight: 12,
         maxWidth: 12,
         marginLeft: 1,
         marginRight: 1,
         marginTop: 0,
         color: theme.palette.primary.main,
      },
   })
);

export const BlockActions = ({ block }: { block: INotionBlockModel }) => {
   const classes = useStyles();
   const sidebar = useSelector(sidebarExtensionSelector, shallowEqual);
   const { enqueueSnackbar } = useSnackbar();

   if (block.blockId == null) {
      return null;
   }

   return (
      <>
         <IconButton
            onClick={(event) => {
               handleNavigateToBlockInNotion(block.blockId);
            }}
            edge="end"
            style={{
               maxHeight: 12,
               maxWidth: 12,
               marginLeft: 1,
               marginRight: 1,
               marginTop: 0,
            }}
            color="default"
            size="small">
            <LightTooltip title="Scroll to block" placement="top">
               <UnfoldMore className={classes.icon} />
            </LightTooltip>
         </IconButton>
         <div></div>
         {sidebar.navigation.notionSite && (
            <IconButton
               onClick={(event) => {
                  handleCopyEmbedBlock(
                     event,
                     block.blockId!,
                     sidebar.navigation.notionSite!,
                     () =>
                        enqueueSnackbar('Copied embed block', {
                           variant: 'info',
                        })
                  );
               }}
               edge="end"
               style={{
                  maxHeight: 12,
                  maxWidth: 12,
                  marginLeft: 1,
                  marginRight: 1,
                  marginTop: 0,
               }}
               color="default"
               size="small">
               <LightTooltip
                  title="Copy a global embed block link"
                  placement="top">
                  <WidgetsTwoTone className={classes.icon} />
               </LightTooltip>
            </IconButton>
         )}
      </>
   );
};
