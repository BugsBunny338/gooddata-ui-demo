import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import DashboardDrawer from "../components/dashboard/DashboardDrawer";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardMain from "../components/dashboard/DashboardMain";
import { DashboardListItems } from "../components/dashboard/DashboardDrawer";

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
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

    console.log(DashboardListItems[0].label)

    const [selectedDimensionItem, setSelectedDimensionItem] = React.useState(DashboardListItems[0]);

    const handleItemSelected = (item) => {
        //We create a new attribute object here to make sure we always trigger state change
        setSelectedDimensionItem({label: item.label, dimension: item.dimension, icon: item.icon});
    }

    return (
            <div className={classes.root}>
                <CssBaseline />
                <DashboardHeader />
                <DashboardDrawer handleItemSelected={handleItemSelected}/>
                <main className={classes.content}>
                    <DashboardMain dimensionItem={selectedDimensionItem} />
                </main>
            </div>
    );
};

export default MyDashboard;
