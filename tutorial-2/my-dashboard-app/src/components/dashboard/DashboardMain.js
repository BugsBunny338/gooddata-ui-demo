import React, { useState } from 'react';

import { newPreviousPeriodMeasure } from '@gooddata/sdk-model';
import { DateFilter, DateFilterHelpers, defaultDateFilterOptions } from '@gooddata/sdk-ui-filters';
import { Headline } from '@gooddata/sdk-ui-charts';
import { InsightView } from '@gooddata/sdk-ui-ext';
import * as Ldm from '../../ldm/full';
import styles from './DashboardMain.module.scss';
import '@gooddata/sdk-ui-filters/styles/css/main.css';

const DashboardMain = () => {
    // This is used to identifiy the data set we will use for all date filtering - better explanatoin ??
    const DATASET = Ldm.DateDatasets.Date.identifier;

    // We enumerate all of the measures we want to display in our headline components, as well as their corresponding previous
    // period measures.
    const revenue = Ldm.Revenue;
    const revenuePrevious = newPreviousPeriodMeasure(revenue, [{ dataSet: DATASET, periodsAgo: 1 }], (m) =>
        m.alias('Previous Period'),
    );

    const orders = Ldm.NrOrdersValid;
    const ordersPrevious = newPreviousPeriodMeasure(orders, [{ dataSet: DATASET, periodsAgo: 1 }], (m) =>
        m.alias('Previous Period'),
    );

    const returnRevenue = Ldm.RevenueReturns;
    const returnRevenuePrevious = newPreviousPeriodMeasure(
        returnRevenue,
        [{ dataSet: DATASET, periodsAgo: 1 }],
        (m) => m.alias('Previous Period'),
    );

    const returns = Ldm.NrOrdersReturns;
    const returnsPrevious = newPreviousPeriodMeasure(returns, [{ dataSet: DATASET, periodsAgo: 1 }], (m) =>
        m.alias('Previous Period'),
    );

    // We use this to set up our
    const [dateFilterOption, setDateFilterOption] = useState(defaultDateFilterOptions.allTime);

    const onApplyDateFilter = (dateFilterOption) => {
        setDateFilterOption(dateFilterOption);
    };

    const dateFilter = DateFilterHelpers.mapOptionToAfm(
        dateFilterOption,
        {
            identifier: DATASET,
        },
        false,
    );

    return (
        <div className={styles.DashboardMain}>
            <div className={styles.Filters}>
                <div className={styles.DateFilterGroup}>
                    <DateFilter
                        selectedFilterOption={dateFilterOption}
                        filterOptions={defaultDateFilterOptions}
                        customFilterName="Select a Date Range"
                        dateFilterMode="active"
                        onApply={onApplyDateFilter}
                    />
                </div>
            </div>
            <div className={styles.KPIs}>
                <div className={styles.KPI}>
                    <span className={styles.Title}>Revenue</span>
                    <Headline
                        primaryMeasure={revenue}
                        secondaryMeasure={revenuePrevious}
                        filters={dateFilter ? [dateFilter] : []}
                    />
                </div>
                <div className={styles.KPI}>
                    <span className={styles.Title}>Orders</span>
                    <Headline
                        primaryMeasure={orders}
                        secondaryMeasure={ordersPrevious}
                        filters={dateFilter ? [dateFilter] : []}
                    />
                </div>
                <div className={styles.KPI}>
                    <span className={styles.Title}>Return Amount</span>
                    <Headline
                        primaryMeasure={returnRevenue}
                        secondaryMeasure={returnRevenuePrevious}
                        filters={dateFilter ? [dateFilter] : []}
                    />
                </div>
                <div className={styles.KPI}>
                    <span className={styles.Title}>Returns</span>
                    <Headline
                        primaryMeasure={returns}
                        secondaryMeasure={returnsPrevious}
                        filters={dateFilter ? [dateFilter] : []}
                    />
                </div>
            </div>
            <div className={styles.Chart}>
                <InsightView
                    insight={Ldm.Insights.RevenueByProductCategory}
                    filters={dateFilter ? [dateFilter] : []}
                />
            </div>
            <div className={styles.Table}>
                <InsightView
                    insight={Ldm.Insights.RevenueByProductCategoryTable}
                    filters={dateFilter ? [dateFilter] : []}
                />
            </div>
        </div>
    );
};

export default DashboardMain;
