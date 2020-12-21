import React, { SyntheticEvent } from 'react';
import {
   createStyles,
   makeStyles,
   Menu,
   MenuItem,
   Typography,
   withStyles,
} from '@material-ui/core';
import {
   FileCopyOutlined,
   Launch,
   UnfoldMore,
   WidgetsTwoTone,
} from '@material-ui/icons';
import { INotionBlockModel } from 'aNotion/models/NotionBlock';
import { sidebarExtensionSelector } from 'aNotion/providers/storeSelectors';
import { useSelector, shallowEqual } from 'react-redux';
import { useSnackbar } from 'notistack';
import { copyToClipboard } from 'aCommon/extensionHelpers';
import { ErrorBoundary } from 'react-error-boundary';
import { SomethingWentWrong } from '../common/Loading';
import { SidebarExtensionState } from '../layout/SidebarExtensionState';
import { getBlockUrl } from 'aNotion/services/notionSiteService';
import {
   EvergreenMessagingEnum,
   TEvergreenMessage,
} from 'aSidebar/sidebarMessaging';

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

const handleCopyEmbedBlock = (
   e: SyntheticEvent,
   blockId: string,
   notionSite: string,
   successCallback?: () => void
) => {
   e.stopPropagation();
   let url = notionSite + blockId.replace(/-/g, '');
   const msg: TEvergreenMessage<string> = {
      payload: url,
      type: EvergreenMessagingEnum.copyToClipboard,
   };
   window.parent.postMessage(msg, '*');
   if (successCallback != null) successCallback();

   return false;
};

const handleCopyLink = (
   e: SyntheticEvent,
   blockId: string,
   pageId: string,
   successCallback?: () => void
) => {
   e.preventDefault();
   const url = getBlockUrl(pageId, blockId);
   const msg: TEvergreenMessage<string> = {
      payload: url,
      type: EvergreenMessagingEnum.copyToClipboard,
   };
   window.parent.postMessage(msg, '*');
   if (successCallback != null) successCallback();
   return false;
};

const handleOpenInNewTab = (
   e: SyntheticEvent,
   blockId: string,
   pageId: string,
   successCallback?: () => void
) => {
   e.preventDefault();
   const url = getBlockUrl(pageId, blockId);
   if (successCallback != null) successCallback();
   window.open(url);
   return false;
};

interface IBlockContextMenuParams {
   block: INotionBlockModel;
   anchorEl: { mouseX: null | number; mouseY: null | number };
   setAnchorEl: React.Dispatch<
      React.SetStateAction<{
         mouseX: null | number;
         mouseY: null | number;
      }>
   >;
   pageId?: string;
}

export const initalAnchorState = {
   mouseX: null,
   mouseY: null,
};

export const BlockContextMenu = ({
   block,
   anchorEl,
   setAnchorEl,
   pageId,
}: IBlockContextMenuParams) => {
   const classes = useStyles();
   const sidebar = useSelector(sidebarExtensionSelector, shallowEqual);
   const { enqueueSnackbar } = useSnackbar();

   const handleClose = () => {
      setAnchorEl(initalAnchorState);
   };

   if (block.blockId == null || sidebar?.navigation?.notionSite == null) {
      return null;
   }

   return (
      <ErrorBoundary FallbackComponent={SomethingWentWrong}>
         <Menu
            id="block-context-menu"
            keepMounted
            open={anchorEl.mouseY !== null}
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={
               anchorEl.mouseY !== null && anchorEl.mouseX !== null
                  ? { top: anchorEl.mouseY, left: anchorEl.mouseX }
                  : undefined
            }>
            <StyledMenuItem
               onClick={(event) => {
                  handleClose();
                  handleCopyEmbedBlock(
                     event,
                     block.blockId,
                     sidebar.navigation.notionSite!,
                     () =>
                        enqueueSnackbar('Copied embed block', {
                           variant: 'info',
                        })
                  );
               }}
               dense>
               <WidgetsTwoTone fontSize="small" className={classes.menuIcon} />
               <Typography variant="caption">
                  {'  Copy embed block '}
               </Typography>
            </StyledMenuItem>
            {pageId != null && (
               <StyledMenuItem
                  onClick={(event) => {
                     handleClose();
                     handleOpenInNewTab(event, block.blockId, pageId, () =>
                        enqueueSnackbar('Opening block in new tab', {
                           variant: 'info',
                        })
                     );
                  }}
                  dense>
                  <Launch fontSize="small" className={classes.menuIcon} />
                  <Typography variant="caption">
                     {'  Open block in a new tab '}
                  </Typography>
               </StyledMenuItem>
            )}
            {pageId != null && (
               <StyledMenuItem
                  onClick={(event) => {
                     handleClose();
                     handleCopyLink(event, block.blockId, pageId, () =>
                        enqueueSnackbar('Copied link to clipboard', {
                           variant: 'info',
                        })
                     );
                  }}
                  dense>
                  <FileCopyOutlined
                     fontSize="small"
                     className={classes.menuIcon}
                  />
                  <Typography variant="caption">
                     {'  Copy link to block '}
                  </Typography>
               </StyledMenuItem>
            )}
         </Menu>
      </ErrorBoundary>
   );
};
