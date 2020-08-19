/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import { Skeleton } from '@material-ui/lab';
import { Typography, Grid, Box } from '@material-ui/core';
//export default hot(Layout);
export const LoadingTab = () => {
   return (
      <Box style={{ padding: 6 }}>
         <Typography variant="h2">
            <Skeleton></Skeleton>
         </Typography>

         <LoadingDetails />
         <LoadingDetails />
         <LoadingDetails />
      </Box>
   );
};

export const LoadingSection = () => {
   return (
      <Box style={{ padding: 6 }}>
         <Typography variant="h4">
            <Skeleton></Skeleton>
         </Typography>

         <LoadingDetails />
         <LoadingDetails />
      </Box>
   );
};

const LoadingDetails = () => {
   return (
      <React.Fragment>
         <Typography variant="h6">
            <Skeleton></Skeleton>
         </Typography>
         <Typography variant="body2">
            <Skeleton></Skeleton>
            <Skeleton></Skeleton>
            <Skeleton></Skeleton>
         </Typography>
         <div style={{ paddingBottom: 18 }}></div>
      </React.Fragment>
   );
};

export const NothingToFind = () => {
   return (
      <Typography
         variant="h6"
         style={{ padding: 7, marginBottom: 15 }}
         gutterBottom>
         🙅🏽 We didn't find anything
      </Typography>
   );
};
