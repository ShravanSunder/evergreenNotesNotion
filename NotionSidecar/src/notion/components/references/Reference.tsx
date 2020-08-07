import React, { MouseEvent, useState } from 'react';

import ReactHtmlParser from 'react-html-parser';

import { Skeleton } from '@material-ui/lab';

import {
   Dialog,
   List,
   ListItem,
   ListItemText,
   Breadcrumbs,
   Typography,
   Grid,
   Tooltip,
   Link,
} from '@material-ui/core';
import { RefData } from './referenceTypes';
import {
   ExpandMoreSharp,
   SystemUpdate,
   FileCopyTwoTone,
} from '@material-ui/icons';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { ErrorFallback, ErrorBoundary } from 'aCommon/Components/ErrorFallback';
import { Content } from '../blocks/Content';
import { OpenInBrowserOutlined } from '@material-ui/icons';
import { lightGreen } from '@material-ui/core/colors';
import { ReferenceActions } from 'aNotion/components/references/ReferenceActions';

import { BlockUi } from '../blocks/BlockUi';
import { withStyles, makeStyles, Theme, createStyles } from '@material-ui/core';

import {
   Accordion as MuiAccordion,
   AccordionSummary as MuiAccordionSummary,
   AccordionDetails as MuiAccordionDetails,
   AccordionActions as MuiAccordionActions,
} from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

export const Accordion = withStyles({
   root: {
      border: '1px solid rgba(0, 0, 0, .125)',
      boxShadow: 'none',

      marginTop: '12px',
      marginBottom: '12px',
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

export const AccordionSummary = withStyles((theme) => ({
   root: {
      backgroundColor: grey[100],
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

export const AccordionDetails = withStyles((theme) => ({
   root: {
      padding: theme.spacing(2),
   },
}))(MuiAccordionDetails);

export const AccordionActions = withStyles((theme) => ({
   root: {
      padding: theme.spacing(2),
      boxShadow: '0px 1px 6px #f5f5f5',
      backgroundColor: grey[50],
   },
}))(MuiAccordionActions);

export const useReferenceStyles = makeStyles((theme: Theme) =>
   createStyles({
      typography: {
         overflowWrap: 'anywhere',
         textAlign: 'left',
      },
      button: {
         fontSize: '0.65rem',
         color: grey[700],
         borderColor: grey[700],
      },
      reference: {
         paddingBottom: theme.spacing(1),
         marginLeft: -theme.spacing(1),
      },
   })
);

export const Reference = ({ refData }: { refData: RefData }) => {
   let classes = useReferenceStyles();
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
               <Grid xs={12} container spacing={1}>
                  <Grid item xs={12} className={classes.reference}>
                     <BlockUi
                        block={refData.searchRecord.notionBlock}
                        index={undefined}></BlockUi>
                  </Grid>
                  <Grid item xs={12}>
                     <div style={{ paddingLeft: 12 }}>
                        <Content
                           blockId={refData.searchRecord.id}
                           contentIds={
                              refData.searchRecord.notionBlock.contentIds
                           }></Content>
                     </div>
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
               return (
                  <React.Fragment key={i}>{getTitle(f, 100)}</React.Fragment>
               );
            }
         })}
      </React.Fragment>
   );
};

const getTitle = (title: string, size: number = 30) => {
   if (title.length > size) return title.substring(0, size) + '... ';
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
