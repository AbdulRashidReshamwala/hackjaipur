import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { Redirect } from 'react-router-dom';
//import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  root: {
    color: 'white',
    flexGrow: 1,
  },
  menuButton: {
    color: 'white',
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Navbar() {
  const classes = useStyles();

  return (
    <div className={ classes.root }>
      <AppBar color="primary" position="fixed">
        <Toolbar>
          <IconButton edge="start" className={ classes.menuButton } color="inherit" aria-label="menu">
          </IconButton>
          <Typography style={{cursor:"pointer"}} onClick={ () => (
            <Redirect to="/" />
          )} variant="h6" className={ classes.title }>
            Dhoom
          </Typography>
            <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}