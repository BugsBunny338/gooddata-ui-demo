import React from "react";
import { emphasize, withStyles } from "@material-ui/core/styles";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Chip from "@material-ui/core/Chip";

const StyledBreadcrumb = withStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.grey[200],
        height: 32,
        padding: 5,
        color: theme.palette.grey[800],
        fontWeight: theme.typography.fontWeightRegular,
        border: "1px solid #CCC",
        "&:hover, &:focus": {
            backgroundColor: theme.palette.grey[300],
        },
        "&:active": {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(theme.palette.grey[500], 0.12),
        },
        "&.Mui-disabled": {
            opacity: 1,
        },
    },
}))(Chip);

const DashboardBreadcrumbs = ({ breadCrumbItems, onClick = () => {}, onDelete = () => {} }) => {
    return (
        <Breadcrumbs separator="/" aria-label="breadcrumb">
            {breadCrumbItems.map((item, index) => (
                <StyledBreadcrumb
                    key={item.label + index}
                    label={item.label}
                    icon={item.icon}
                    onClick={index < breadCrumbItems.length ? () => onClick(item, index) : null}
                    onDelete={index > 0 ? () => onDelete(item, index) : null}
                />
            ))}
        </Breadcrumbs>
    );
};

export default DashboardBreadcrumbs;
