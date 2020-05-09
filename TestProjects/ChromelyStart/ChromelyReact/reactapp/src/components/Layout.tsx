import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, } from '@material-ui/core';
import { IconButton, } from '@material-ui/core';
import MenuIcon  from '@material-ui/icons/Menu';


interface AppProps {
    Title: string
}

export const Header: React.FC<AppProps> =
    (props: AppProps) => (
        <AppBar>
          <Toolbar variant="dense">
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
          <Typography variant="h6" color="inherit">
            {props.Title}
            </Typography>
          </Toolbar>
        </AppBar>
    );

