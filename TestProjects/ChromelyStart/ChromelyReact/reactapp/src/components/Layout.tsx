import React, { SyntheticEvent } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, Button, } from '@material-ui/core';
import { IconButton, } from '@material-ui/core';
import MenuIcon  from '@material-ui/icons/Menu';
import { openExternalUrl } from '/services/Chromely.Service.js'; 

interface AppProps {
    Title: string
}

export const Header: React.FC<AppProps> =
    (props: AppProps) => (
      <AppBar position="sticky">
          <Toolbar variant="dense">
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
          <Typography variant="h6" color="inherit">
            {props.Title}
          </Typography>
          <Button color="inherit" onClick={showDevTools} >Debug</Button>
          </Toolbar>
        </AppBar>
    );



    
export function showDevTools(event: SyntheticEvent) {
  event.preventDefault();
  openExternalUrl("http://trak-command.com/search/showdevtools");
}