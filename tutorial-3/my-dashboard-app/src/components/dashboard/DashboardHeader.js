import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowBack from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: theme.spacing(2),
    },
    backButton: {
        marginRight: theme.spacing(1),
    },
    title: {
        flexGrow: 1,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    bold: {
        fontWeight: 800,
    },
}));

const DashboardHeader = () => {
    const classes = useStyles();
    return (
        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
                <IconButton
                    edge="start"
                    className={classes.backButton}
                    aria-label="menu"
                    component={Link}
                    to="/"
                >
                    <ArrowBack style={{ color: '#FFF', fontSize: 30 }} />
                </IconButton>
                <Typography variant="h5" className={classes.title}>
                    <span className={classes.bold}>GoodData.UI Demo</span>
                    <span> — Making Dashboards Interactive</span>
                </Typography>
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                    <MenuIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default DashboardHeader;
