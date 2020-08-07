import React, { MouseEvent, useState, SyntheticEvent } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import ReactHtmlParser from 'react-html-parser';

import { Skeleton } from '@material-ui/lab';

import {
   Button,
   Dialog,
   List,
   ListItem,
   ListItemText,
   Breadcrumbs,
   Typography,
   Grid,
   withStyles,
   makeStyles,
   Theme,
   createStyles,
   AccordionActions,
   Tooltip,
   IconButton,
   Link,
} from '@material-ui/core';
import {
   Accordion as MuiAccordion,
   AccordionSummary as MuiAccordionSummary,
   AccordionDetails as MuiAccordionDetails,
} from '@material-ui/core';
import { RefData } from './referenceTypes';
import {
   ExpandMoreSharp,
   SystemUpdate,
   FileCopyTwoTone,
   LinkOutlined,
} from '@material-ui/icons';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { ErrorFallback, ErrorBoundary } from 'aCommon/Components/ErrorFallback';
import { Content } from '../blocks/Content';
import { navigationSelector } from 'aNotion/providers/storeSelectors';
import {
   Launch,
   FileCopyOutlined,
   WidgetsTwoTone,
   OpenInBrowserOutlined,
} from '@material-ui/icons';
import { copyToClipboard } from 'aCommon/extensionHelpers';
import { LightTooltip } from '../Styles';
import { grey } from '@material-ui/core/colors';
import { useSnackbar } from 'notistack';

const Accordion = withStyles({
   root: {
      border: '1px solid rgba(0, 0, 0, .125)',
      boxShadow: 'none',

      marginTop: '12px',
      marginBottom: '12px',
      // '&:not(:last-child)': {
      //    borderBottom: 0,
      // },
      '&:before': {
         display: 'none',
      },
      '&$expanded': {
         margin: 'auto',
         marginTop: '24px',
         marginBottom: '24px',
      },
   },
   expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles((theme) => ({
   root: {
      backgroundColor: grey[50],
      borderBottom: '1px solid rgba(0, 0, 0, .125)',
      marginBottom: -1,
      minHeight: 42,
      '&$expanded': {
         minHeight: 51,
      },
   },
   content: {
      '&$expanded': {
         margin: '12px 0',
      },
   },
   expanded: {},
}))(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
   root: {
      padding: theme.spacing(2),
      '&$expanded': {
         minHeight: 32,
      },
   },
}))(MuiAccordionDetails);

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      typography: {
         overflowWrap: 'anywhere',
         textAlign: 'left',
      },
      button: {
         fontSize: '0.65rem',
      },
   })
);

const ReferenceActions = ({ refData }: { refData: RefData }) => {
   const navigation = useSelector(navigationSelector, shallowEqual);
   const { enqueueSnackbar } = useSnackbar();

   let classes = useStyles();

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

export const Reference = ({ refData }: { refData: RefData }) => {
   let classes = useStyles();
   return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
         <Accordion TransitionProps={{ unmountOnExit: true }}>
            <AccordionSummary expandIcon={<ExpandMoreSharp />}>
               <Grid container spacing={1}>
                  <Grid item xs={12}>
                     <Typography variant="body1" className={classes.typography}>
                        {parse(refData.searchRecord.textByContext)}
                     </Typography>
                  </Grid>
                  <Grid item xs>
                     <Path path={refData.searchRecord.path}></Path>
                  </Grid>
               </Grid>
            </AccordionSummary>
            <AccordionActions>
               <ReferenceActions refData={refData}></ReferenceActions>
            </AccordionActions>
            <AccordionDetails>
               <Grid container spacing={1}>
                  <Grid item xs={12}>
                     <Content
                        blockId={refData.searchRecord.id}
                        contentIds={
                           refData.searchRecord.notionBlock.contentIds
                        }></Content>
                  </Grid>
               </Grid>
            </AccordionDetails>
         </Accordion>
      </ErrorBoundary>
   );
};

const parse = (textByContext: string[]) => {
   return (
      <React.Fragment>
         {textByContext.map((f, i) => {
            if (i % 2 === 1) {
               return <strong key={i}>{f}</strong>;
            } else {
               return <React.Fragment key={i}>{f}</React.Fragment>;
            }
         })}
      </React.Fragment>
   );
};

const getTitle = (title: string) => {
   if (title.length > 30) return title.substring(0, 30) + '...';
   else return title;
};

const Path = ({ path }: { path: NotionBlockModel[] }) => {
   return (
      <Breadcrumbs maxItems={4}>
         {path.map((p) => (
            <Typography variant="caption" key={p.blockId}>
               {getTitle(p.simpleTitle)}
            </Typography>
         ))}
      </Breadcrumbs>
   );
};
