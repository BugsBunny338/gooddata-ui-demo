import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import RegionIcon from "@material-ui/icons/Public";
import CategoryIcon from "@material-ui/icons/Category";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ExploreIcon from "@material-ui/icons/Explore";
import * as Ldm from "../../ldm/full";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({

    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerContainer: {
        overflow: "auto",
    },
}));

export const DashboardListItems = [
    { label: "Product Category", dimension: Ldm.ProductCategory, icon: <CategoryIcon /> },
    { label: "Customer Region", dimension: Ldm.CustomerRegion, icon: <RegionIcon /> },
];

const AppListItems = [
    { label: "My Dashboard", icon: <DashboardIcon /> },
    { label: "Explore", icon: <ExploreIcon /> },
];

const DashboardDrawer = ({handleItemSelected = (dimension) => {} }) => {
    const classes = useStyles();

    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const handleListItemClick = (event, item, index) => {
      console.log("choosing = " + item.dimension.attribute.displayForm.identifier)
        setSelectedIndex(index);
        handleItemSelected(item);
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <Toolbar />
                <div className={classes.drawerContainer}>
                    <List>
                        {DashboardListItems.map((item, index) => (
                            <ListItem
                                button
                                key={item.label}
                                selected={selectedIndex === index}
                                onClick={event => handleListItemClick(event, item, index)}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.label} />
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <List>
                        {AppListItems.map((item, index) => (
                            <ListItem button key={item.label}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.label} />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Drawer>
        </div>
    );
};

export default DashboardDrawer;
