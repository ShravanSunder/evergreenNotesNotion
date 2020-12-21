import React, { SyntheticEvent } from 'react';
import {
   createStyles,
   IconButton,
   ListItemIcon,
   Box,
   ListItemText,
   makeStyles,
   Menu,
   MenuItem,
   Typography,
   withStyles,
} from '@material-ui/core';
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

const StyledMenuItem = withStyles((theme) => ({
   root: {
      height: theme.spacing(3),
      padding: theme.spacing(2),
      margin: theme.spacing(1),
   },
}))(MenuItem);

export const BlockActions = ({ block }: { block: INotionBlockModel }) => {
   const classes = useStyles();
   const sidebar = useSelector(sidebarExtensionSelector, shallowEqual);
   const { enqueueSnackbar } = useSnackbar();

   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
   const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
   };
   const handleClose = () => {
      setAnchorEl(null);
   };

   if (block.blockId == null) {
      return null;
   }

   return (
      <>
         <IconButton
            onClick={(event) => {
               handleClick(event);
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
            <LightTooltip title="Click to open menu" placement="top">
               <MoreVert className={classes.icon} />
            </LightTooltip>
         </IconButton>
         <Menu
            id="block-actions-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}>
            <StyledMenuItem
               onClick={(event) => handleNavigateToBlockInNotion(block.blockId)}
               dense>
               <UnfoldMore fontSize="small" style={{ marginRight: 6 }} />
               <Typography variant="caption">{'  Scroll to block '}</Typography>
            </StyledMenuItem>
            {sidebar.navigation.notionSite && (
               <StyledMenuItem
                  onClick={(event) => {
                     handleCopyEmbedBlock(
                        event,
                        block.blockId,
                        sidebar.navigation.notionSite!,
                        () =>
                           enqueueSnackbar('Copied embed block', {
                              variant: 'info',
                           })
                     );
                     handleClose();
                  }}
                  dense>
                  <WidgetsTwoTone fontSize="small" style={{ marginRight: 6 }} />
                  <Typography variant="caption">
                     {'  Copy embed block '}
                  </Typography>
               </StyledMenuItem>
            )}
         </Menu>
      </>
   );
};
