import React from 'react';
import { Typography } from '@material-ui/core';

export const NoNotionPageId = () => {
   return (
      <div style={{ padding: 12 }}>
         <div style={{ marginTop: 60 }}></div>
         <Typography variant="h5" style={{ marginTop: 12 }}>
            😵 Couldn't load notion page.
         </Typography>
         <Typography
            variant="subtitle1"
            style={{ marginTop: 12, marginLeft: 3 }}>
            🙋🏾‍♂️ Are you sure you have full access to the space?
         </Typography>
      </div>
   );
};
