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
   withStyles,
   makeStyles,
   createStyles,
   Theme,
} from '@material-ui/core';
import {
   currentRecordSelector,
   referenceSelector,
} from 'aNotion/providers/storeSelectors';
import { SearchSort } from 'aNotion/api/v3/apiReqTypes';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { AppPromiseDispatch } from 'aNotion/providers/reduxStore';

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      sections: {
         marginLeft: 6,
         marginTop: 12,
         marginBottom: 6,
      },
   })
);

// comment
export const HighlightsPane = () => {
   const dispatch: AppPromiseDispatch<any> = useDispatch();
   const record = useSelector(currentRecordSelector, shallowEqual);
   const references = useSelector(referenceSelector, shallowEqual);
   const pageName = record.pageRecord?.simpleTitle;
   const pageId = record.pageRecord?.blockId as string;

   let refeStyles = useStyles();
   useEffect(() => {
      if (record.status === thunkStatus.fulfilled && pageName != null) {
         //    const pr = dispatch(
         //       referenceActions.fetchRefsForPage({ query: pageName, pageId })
         //    );
         //    return () => {
         //       pr.abort();
         //    };
         // } else if (record.status === thunkStatus.pending) {
      }
      return () => {};
   }, [record.status, dispatch, record.pageRecord, pageName, pageId]);

   return (
      <React.Fragment>
         {references.pageReferencesStatus === thunkStatus.rejected && (
            <div>error!</div>
         )}
      </React.Fragment>
   );
};

export default HighlightsPane;
