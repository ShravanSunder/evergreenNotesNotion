import React, { useEffect, MouseEvent, useState } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import { Skeleton } from '@material-ui/lab';

import {
   Button,
   Dialog,
   List,
   ListItem,
   ListItemText,
   Typography,
   Grid,
   Accordion,
   AccordionSummary,
   AccordionDetails,
} from '@material-ui/core';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { AppPromiseDispatch } from 'aNotion/providers/reduxStore';
import { RefData } from './referenceTypes';
import { ExpandMore } from '@material-ui/icons';

// comment
export const Reference = ({ refData }: { refData: RefData }) => {
   return (
      <Accordion>
         <AccordionSummary expandIcon={<ExpandMore />}>
            <Grid container>
               <Grid item xs>
                  <Typography variant="body1" style={{ paddingTop: 6 }}>
                     {refData.searchRecord.text}
                  </Typography>
               </Grid>
            </Grid>
         </AccordionSummary>
         <AccordionDetails></AccordionDetails>
      </Accordion>
   );
};
