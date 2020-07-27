import React, { useEffect, MouseEvent, useState } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

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
} from '@material-ui/core';
import {
   Accordion as MuiAccordion,
   AccordionSummary as MuiAccordionSummary,
   AccordionDetails as MuiAccordionDetails,
} from '@material-ui/core';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { AppPromiseDispatch } from 'aNotion/providers/reduxStore';
import { RefData } from './referenceTypes';
import { ExpandMoreSharp } from '@material-ui/icons';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';

const Accordion = withStyles({
   root: {
      border: '1px solid rgba(0, 0, 0, .125)',
      boxShadow: 'none',
      // '&:not(:last-child)': {
      //    borderBottom: 0,
      // },
      '&:before': {
         display: 'none',
      },
      '&$expanded': {
         margin: 'auto',
         marginTop: '12px',
         marginBottom: '12px',
      },
   },
   expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles((theme) => ({
   root: {
      backgroundColor: theme.palette.primary.main,
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
         minHeight: 51,
      },
   },
}))(MuiAccordionDetails);

// comment

const Path = ({ path }: { path: NotionBlockModel[] }) => {
   return (
      <Breadcrumbs maxItems={4}>
         {path.map((p) => (
            <Typography variant="caption" key={p.blockId}>
               {getTitle(p.title)}
            </Typography>
         ))}
      </Breadcrumbs>
   );
};

export const Reference = ({ refData }: { refData: RefData }) => {
   return (
      <Accordion TransitionProps={{ unmountOnExit: true }}>
         <AccordionSummary expandIcon={<ExpandMoreSharp />}>
            <Grid container spacing={1}>
               <Grid item xs={12}>
                  <Typography variant="body1">
                     {parse(refData.searchRecord.textByContext)}
                  </Typography>
               </Grid>
               <Grid item xs>
                  <Path path={refData.searchRecord.path}></Path>
               </Grid>
            </Grid>
         </AccordionSummary>
         <AccordionDetails></AccordionDetails>
      </Accordion>
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
