/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useEffect, MouseEvent, useState } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import {
   Typography,
   makeStyles,
   createStyles,
   Theme,
   TextField,
} from '@material-ui/core';
import {
   currentRecordSelector,
   referenceSelector,
} from 'aNotion/providers/storeSelectors';
import { referenceActions } from './referenceSlice';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { AppPromiseDispatch } from 'aNotion/providers/appDispatch';
import { Reference } from './Reference';
import { SearchReferences, defaultReferences } from './referenceState';
import { LoadingTab, NothingToFind } from '../common/Loading';
import { useFetchApi, UseFetchCallbackType } from '../../hooks/useFetchApi';
import { searchNotion } from 'aNotion/services/referenceService';

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      sections: {
         marginLeft: 6,
         marginTop: 12,
         marginBottom: 6,
      },
   })
);

const search: UseFetchCallbackType<SearchReferences> = (
   query: string | undefined
) => {
   const ab = new AbortController();
   let result = searchNotion(query ?? '', ab);
   return [result, ab];
};

// comment
export const SearchPane = () => {
   const dispatch: AppPromiseDispatch<any> = useDispatch();
   const { searchQueries } = useSelector(referenceSelector, shallowEqual);

   let [status, result, setSearchText] = useFetchApi<SearchReferences>(search);

   const handleTextChanged = (e: any) => {
      let text = e.target.value;
      dispatch(referenceActions.addSearchQueries(text));
      setSearchText(text);
   };

   result = result ?? defaultReferences();

   return (
      <React.Fragment>
         <TextField
            fullWidth
            size="small"
            variant="outlined"
            onChange={handleTextChanged}></TextField>
         <FullReferences
            searchResults={result}
            status={status}></FullReferences>
         <RelatedReferences
            searchResults={result}
            status={status}></RelatedReferences>
         {status === thunkStatus.rejected && <div>error!</div>}
      </React.Fragment>
   );
};
export default SearchPane;

const FullReferences = ({
   searchResults,
   status,
}: {
   searchResults: SearchReferences;
   status: thunkStatus;
}) => {
   let classes = useStyles();

   let fullTitle = searchResults.fullTitle;
   let direct = searchResults.direct;

   return (
      <React.Fragment>
         {status === thunkStatus.pending && <LoadingTab></LoadingTab>}
         {status === thunkStatus.fulfilled && (
            <React.Fragment>
               <Typography className={classes.sections} variant="h5">
                  <b>References</b>
               </Typography>
               {direct.map((u) => {
                  return (
                     <Reference key={u.searchRecord.id} refData={u}></Reference>
                  );
               })}
               {fullTitle.map((u) => {
                  return (
                     <Reference key={u.searchRecord.id} refData={u}></Reference>
                  );
               })}
               {fullTitle.length === 0 && direct.length === 0 && (
                  <NothingToFind />
               )}
            </React.Fragment>
         )}
      </React.Fragment>
   );
};

const RelatedReferences = ({
   searchResults,
   status,
}: {
   searchResults: SearchReferences;
   status: thunkStatus;
}) => {
   let classes = useStyles();

   let data = searchResults.related;

   return (
      <React.Fragment>
         {status === thunkStatus.pending && <LoadingTab></LoadingTab>}
         {status === thunkStatus.fulfilled && (
            <React.Fragment>
               <Typography className={classes.sections} variant="h5">
                  <b>Related Searches</b>
               </Typography>
               {data.map((u) => {
                  return (
                     <Reference key={u.searchRecord.id} refData={u}></Reference>
                  );
               })}
               {data.length === 0 && <NothingToFind />}
            </React.Fragment>
         )}
      </React.Fragment>
   );
};
