import React, { SyntheticEvent } from 'react';
import {
   createStyles,
   IconButton,
   ListItemIcon,
   Box,
   ListItemText,
   makeStyles,
} from '@material-ui/core';
import { UnfoldMore, MoreVert, DragIndicator } from '@material-ui/icons';
import { INotionBlockModel } from 'aNotion/models/NotionBlock';
import {
   EvergreenMessagingEnum,
   TEvergreenMessage,
} from 'aSidebar/sidebarMessaging';
import { LightTooltip } from 'aNotion/components/common/TooltipStyles';
import { copyToClipboard } from 'aCommon/extensionHelpers';

export const handleNavigateToBlockInNotion = (blockId: string) => {
   const msg: TEvergreenMessage<string> = {
      payload: blockId,
      type: EvergreenMessagingEnum.navigateToBlock,
   };
   window.parent.postMessage(msg, '*');
};

export const useStyles = makeStyles((theme) =>
   createStyles({
      icon: {
         maxHeight: theme.spacing(2),
         maxWidth: theme.spacing(2),
         marginLeft: 1,
         marginRight: 1,
         marginTop: 0,
         color: theme.palette.primary.main,
      },
      menuIcon: {
         marginRight: theme.spacing(1.5),
      },
   })
);

export const BlockActions = ({ block }: { block: INotionBlockModel }) => {
   const classes = useStyles();

   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
   const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
   };

   return (
      <>
         <IconButton
            onClick={(event) => handleNavigateToBlockInNotion(block.blockId)}
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
      </>
   );
};
