import React, { useState } from "react";
import styles from "./DashboardMain.module.scss";

// This line here is super important;
import * as Ldm from "../../ldm/full";
import { newRelativeDateFilter } from "@gooddata/sdk-model";
import { InsightView } from "@gooddata/sdk-ui-ext";

import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
const DashboardMainInsightView = () => {

    const [timeGrain, setTimeGrain] = useState(0);

    const DATASET = "date.dataset.dt";
    const dateGrainFilters = [
        newRelativeDateFilter(DATASET, "GDC.time.year", -1, -1),
        newRelativeDateFilter(DATASET, "GDC.time.quarter", -1, -1),
        newRelativeDateFilter(DATASET, "GDC.time.month", -1, -1),
    ]

    const [dateGrainFilter, setDateGrainFilter] = useState(dateGrainFilters[0])
    const [timeGrainLabel, setTimeGrainLabel] = useState("Year")

    const handleTimeGrainChange = (value) => {
        setDateGrainFilter(dateGrainFilters[value]);
        setTimeGrainLabel(["Year", "Quarter", "Month"][value]);
        setTimeGrain(value);
    }

    return (
        <div className={styles.DashboardMain}>
            <div className={styles.Filters}>
                <div className={styles.ButtonGroup}>
                    <ButtonGroup color="primary" aria-label="outlined primary button group">
                        <Button variant={timeGrain === 0 ? "contained" : "outlined"} onClick={ () => handleTimeGrainChange(0)}>This Year</Button>
                        <Button variant={timeGrain === 1 ? "contained" : "outlined"} onClick={ () => handleTimeGrainChange(1)}>This Quarter</Button>
                        <Button variant={timeGrain === 2 ? "contained" : "outlined"} onClick={ () => handleTimeGrainChange(2)}>This Month</Button>
                    </ButtonGroup>
                </div>
            </div>
            <div className={styles.KPIs}>
                <div className={styles.KPI}>
                    <span className={styles.Title}>This {timeGrainLabel} Sales</span>
                    <InsightView insight={Ldm.Insights.KPITotalSales} filters={[dateGrainFilter]} />
                </div>
                <div className={styles.KPI}>
                    <span className={styles.Title}>This {timeGrainLabel} Profit</span>
                    <InsightView insight={Ldm.Insights.KPITotalProfit} filters={[dateGrainFilter]} />
                </div>
                <div className={styles.KPI}>
                    <span className={styles.Title}>This {timeGrainLabel} Returns</span>
                    <InsightView insight={Ldm.Insights.KPITotalReturns} filters={[dateGrainFilter]} />
                </div>
                <div className={styles.KPI}>
                    <span className={styles.Title}>This {timeGrainLabel} Transactions</span>
                    <InsightView insight={Ldm.Insights.KPITotalTransactions} filters={[dateGrainFilter]} />
                </div>
            </div>
            <div className={styles.Chart}>
                <InsightView insight={Ldm.Insights.RevenueTrendByProductCategory} filters={[dateGrainFilter]}/>
            </div>
            <div className={styles.Table}>
                <InsightView insight={Ldm.Insights.MeasuresByProductCategoruy} filters={[dateGrainFilter]}/>
            </div>
        </div>
    );
};

export default DashboardMainInsightView;
