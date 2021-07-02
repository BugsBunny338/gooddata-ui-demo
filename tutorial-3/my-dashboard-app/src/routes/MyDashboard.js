import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import DashboardDrawer from '../components/dashboard/DashboardDrawer';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardMain from '../components/dashboard/DashboardMain';
import { DashboardListItems } from '../components/dashboard/DashboardDrawer';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

// This component is the main html structure for our dashboard screen, it includes:
// - Top App Bar
// - Left Drawer to hold our Filter items
// - Main Dashboard Screen

const MyDashboard = () => {
    const classes = useStyles();
    const [dimension, setDimension] = useState(DashboardListItems[0]);

    return (
        <div className={classes.root}>
            <CssBaseline />
            <DashboardHeader />
            <DashboardDrawer dimension={dimension} setDimension={setDimension} />
            <main className={classes.content}>
                {/* TODO rename dimensionItem to dimension */}
                <DashboardMain dimensionItem={dimension} />
            </main>
        </div>
    );
};

export default MyDashboard;
