/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useEffect, MouseEvent, useState, SyntheticEvent } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import {
   Typography,
   makeStyles,
   createStyles,
   Theme,
   TextField,
   Popover,
   Grid,
   IconButton,
   ListItem,
   List,
   ListItemText,
} from '@material-ui/core';
import { referenceSelector } from 'aNotion/providers/storeSelectors';
import { referenceActions } from './referenceSlice';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { AppPromiseDispatch } from 'aNotion/providers/appDispatch';
import { Reference } from './Reference';
import { SearchReferences, defaultSearchReferences } from './referenceState';
import { LoadingTab, NothingToFind } from '../common/Loading';
import { useApi, UseApiPromise } from '../../hooks/useApiPromise';
import { searchNotion } from 'aNotion/services/referenceService';
import {
   usePopupState,
   bindToggle,
   bindPopover,
} from 'material-ui-popup-state/hooks';
import HistoryIcon from '@material-ui/icons/History';
import { grey } from '@material-ui/core/colors';

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      sections: {
         marginLeft: 6,
         marginTop: 12,
         marginBottom: 6,
      },
   })
);

const search: UseApiPromise<SearchReferences, string> = (
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

   const [text, setText] = useState<string>();

   let [status, result, setSearchText, searchText] = useApi<
      SearchReferences,
      string
   >(search);

   const popupState = usePopupState({
      variant: 'popper',
      popupId: 'searchPopper',
   });

   const handleTextChanged = (e: any) => {
      let text = e.target.value;
      setSearchText(text);
      setText(text);
   };

   useEffect(() => {
      if (status === thunkStatus.fulfilled && searchText != null) {
         dispatch(referenceActions.addSearchQueries(searchText));
      }
   }, [status, searchText, dispatch]);

   result = result ?? defaultSearchReferences();

   return (
      <React.Fragment>
         <Grid container>
            <Grid item xs>
               <TextField
                  value={text}
                  fullWidth
                  size="small"
                  helperText="Enter text to search"
                  variant="outlined"
                  onChange={handleTextChanged}></TextField>
            </Grid>
            <Grid item xs={1}>
               <IconButton
                  size="small"
                  {...bindToggle(popupState)}
                  style={{ marginTop: 3 }}>
                  <HistoryIcon></HistoryIcon>
               </IconButton>
            </Grid>
         </Grid>
         <Popover
            {...bindPopover(popupState)}
            anchorOrigin={{
               vertical: 'bottom',
               horizontal: 'right',
            }}
            transformOrigin={{
               vertical: 'top',
               horizontal: 'right',
            }}>
            <div style={{ margin: 6, padding: 6 }}>
               <Typography
                  variant="subtitle1"
                  style={{
                     margin: 12,
                     marginBottom: 3,
                  }}>
                  {'  '}
                  <strong>Search History</strong>
               </Typography>
               <List dense>
                  {searchQueries.map((s) => {
                     const handleHistoryClick = (e: any) => {
                        setSearchText(s);
                        setText(s);
                        popupState.close();
                     };
                     return (
                        <ListItem key={s} button onClick={handleHistoryClick}>
                           <ListItemText primary={s} />
                        </ListItem>
                     );
                  })}
               </List>
            </div>
         </Popover>
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

   return (
      <React.Fragment>
         {status === thunkStatus.pending && <LoadingTab></LoadingTab>}
         {status === thunkStatus.fulfilled && (
            <React.Fragment>
               <Typography className={classes.sections} variant="h5">
                  <b>References</b>
               </Typography>
               {fullTitle.map((u) => {
                  return <Reference key={u.id} refData={u}></Reference>;
               })}
               {fullTitle.length === 0 && <NothingToFind />}
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
                  return <Reference key={u.id} refData={u}></Reference>;
               })}
               {data.length === 0 && <NothingToFind />}
            </React.Fragment>
         )}
      </React.Fragment>
   );
};
