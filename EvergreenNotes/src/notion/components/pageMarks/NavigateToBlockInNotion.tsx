import React from 'react';
import { IconButton } from '@material-ui/core';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import { INotionBlockModel } from 'aNotion/models/NotionBlock';
import {
   EvergreenMessagingEnum,
   TEvergreenMessage,
} from 'aSidebar/sidebarMessaging';
import { grey } from '@material-ui/core/colors';
import { LightTooltip } from '../common/Styles';

export const handleNavigateToBlockInNotion = (blockId: string) => {
   const msg: TEvergreenMessage<string> = {
      payload: blockId,
      type: EvergreenMessagingEnum.navigateToBlock,
   };
   window.parent.postMessage(msg, '*');
};

export const NavigateToBlockInNotion = ({
   block,
}: {
   block: INotionBlockModel;
}) => {
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
               <ZoomOutMapIcon
                  style={{
                     maxHeight: 13,
                     maxWidth: 13,
                     margin: 0,
                     color: grey[600],
                  }}
               />
            </LightTooltip>
         </IconButton>
      </>
   );
};
