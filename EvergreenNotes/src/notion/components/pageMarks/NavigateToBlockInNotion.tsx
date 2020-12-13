import React from 'react';
import { createStyles, IconButton, makeStyles } from '@material-ui/core';
import VerticalAlignBottomIcon from '@material-ui/icons/VerticalAlignBottom';
import { INotionBlockModel } from 'aNotion/models/NotionBlock';
import {
   EvergreenMessagingEnum,
   TEvergreenMessage,
} from 'aSidebar/sidebarMessaging';
import { LightTooltip } from '../common/Styles';

export const handleNavigateToBlockInNotion = (blockId: string) => {
   const msg: TEvergreenMessage<string> = {
      payload: blockId,
      type: EvergreenMessagingEnum.navigateToBlock,
   };
   window.parent.postMessage(msg, '*');
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

export const NavigateToBlockInNotion = ({
   block,
}: {
   block: INotionBlockModel;
}) => {
   const classes = useStyles();

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
               <VerticalAlignBottomIcon className={classes.icon} />
            </LightTooltip>
         </IconButton>
      </>
   );
};
