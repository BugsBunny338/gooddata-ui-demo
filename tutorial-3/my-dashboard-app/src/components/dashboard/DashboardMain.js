import React, { useState, useEffect } from "react";
import styles from "./DashboardMain.module.scss";
import cx from "classnames";
import * as Ldm from "../../ldm/full";
import { newPreviousPeriodMeasure, newPositiveAttributeFilter } from "@gooddata/sdk-model";
import { DateFilter, DateFilterHelpers, defaultDateFilterOptions } from "@gooddata/sdk-ui-filters";
import { Headline, AreaChart } from "@gooddata/sdk-ui-charts";
import { PivotTable } from "@gooddata/sdk-ui-pivot";
import { HeaderPredicates } from "@gooddata/sdk-ui";
import DateRangeIcon from "@material-ui/icons/DateRange";
import DashboardBreadcrumbs from "./DashboardBreadcrumbs";
import "@gooddata/sdk-ui-filters/styles/css/main.css";

const DashboardMain = ({ dimensionItem }) => {
    // This is used to identifiy the data set we will use for all date filtering - better explanatoin ??
    const DATASET = "date.dataset.dt";
    const GRAIN_DAY = "GDC.time.date";
    const GRAIN_MONTH = "GDC.time.month";
    const GRAIN_QUARTER = "GDC.time.quarter";

    // We use this object to hold state on our filters for dimension selection and drill down.
    // We keep both of these in the same object so we don't trigger mutliple state updates to our child components
    // if they were kept in separate objects.
    const [filter, setFilter] = useState({ attributeFilter: null, dimension: dimensionItem.dimension });
    const [breadCrumbItems, setBreadCrumbItems] = useState([dimensionItem]);
    const [chartDateGrain, setChartDateGrain] = useState([Ldm.DateMonth.Short]);

    useEffect(() => {
        console.log("resetting dimension  to " + dimensionItem.dimension.attribute.displayForm.identifier);
        setBreadCrumbItems([dimensionItem]);
        setFilter({ attributeFilter: null, dimension: dimensionItem.dimension });
    }, [dimensionItem]);

    // We enumerate all of the measures we want to display in our headline components, as well as their corresponding previous
    // period measures.
    const revenue = Ldm.Revenue;
    const revenuePrevious = newPreviousPeriodMeasure(revenue, [{ dataSet: DATASET, periodsAgo: 1 }], (m) =>
        m.alias("Previous Period"),
    );

    const orders = Ldm.NrOfValidOrders;
    const ordersPrevious = newPreviousPeriodMeasure(orders, [{ dataSet: DATASET, periodsAgo: 1 }], (m) =>
        m.alias("Previous Period"),
    );

    const returnRevenue = Ldm.RevenueReturns;
    const returnRevenuePrevious = newPreviousPeriodMeasure(
        returnRevenue,
        [{ dataSet: DATASET, periodsAgo: 1 }],
        (m) => m.alias("Previous Period"),
    );

    const returns = Ldm.NrOrdersReturns;
    const returnsPrevious = newPreviousPeriodMeasure(returns, [{ dataSet: DATASET, periodsAgo: 1 }], (m) =>
        m.alias("Previous Period"),
    );
    const [selectedMeasure, setSelectedMeasure] = useState(revenue);

    // We use these constants to set up our date filter
    //   const availableGranularities = ["GDC.time.date", "GDC.time.month", "GDC.time.quarter", "GDC.time.year"];
    const [dateFilterOptions, setDateFilterOptions] = useState(defaultDateFilterOptions.allTime);
    const [excludeCurrentPeriod, setExcludeCurrentPeriod] = useState(false);

    // When the user clicks on the date filter "apply" button we execute the following:
    const onApplyDateFilter = (dateFilterOption, excludeCurrentPeriod) => {
        let grain = Ldm.DateMonth.Short;
        if (
            (dateFilterOption.granularity === GRAIN_DAY && dateFilterOption.from > -32) ||
            (dateFilterOption.granularity === GRAIN_MONTH && dateFilterOption.from > -2)
        ) {
            grain = Ldm.DateDate.MmDdYyyy;
        } else if (
            (dateFilterOption.granularity === GRAIN_DAY && dateFilterOption.from > -180) ||
            (dateFilterOption.granularity === GRAIN_MONTH && dateFilterOption.from > -7) ||
            (dateFilterOption.granularity === GRAIN_QUARTER && dateFilterOption.from > -3)
        ) {
            grain = Ldm.DateWeekSunSatYear.WkQtrYear_1;
        }
        setChartDateGrain(grain);
        setDateFilterOptions(dateFilterOption);
        setExcludeCurrentPeriod(excludeCurrentPeriod);
    };

    // Our date filter that will be refernced by our headline components and charts.
    // Each time this filter is reset the UI will automatically refresh.
    const dateFilter = DateFilterHelpers.mapOptionToAfm(
        dateFilterOptions,
        {
            identifier: DATASET,
        },
        excludeCurrentPeriod,
    );

    const changeMeasure = (measure) => {
        setSelectedMeasure(measure);
    };

    const handleDrillDown = (drillDimensionName) => {
        // Create a new dimension grain based on current active dimension
        // (Product Category -> Product Id)
        // (Customer Region -> Customer State)
        const newDimension =
            dimensionItem.dimension === Ldm.ProductCategory ? Ldm.Product.Default : Ldm.CustomerState;

        // Create filter based on drill dimension name
        const newFilter = newPositiveAttributeFilter(filter.dimension, [drillDimensionName]);

        setFilter({ attributeFilter: newFilter, dimension: newDimension });
        setBreadCrumbItems([dimensionItem, { label: drillDimensionName, dimension: null, icon: null }]);
    };

    const isDrillable = () => {
        // console.log("checking to see if we can drill");
        // debugger;
        return (
            filter.dimension.attribute.localIdentifier === Ldm.ProductCategory.attribute.localIdentifier ||
            filter.dimension.attribute.localIdentifier === Ldm.CustomerRegion.attribute.localIdentifier
        );
    };

    const removeBreadCrumbChildren = (parentIndex) => {
        if (parentIndex === breadCrumbItems.length - 1) return;
        breadCrumbItems.splice(parentIndex + 1, breadCrumbItems.length - parentIndex);
        setFilter({ attributeFilter: null, dimension: breadCrumbItems[parentIndex].dimension });
        setBreadCrumbItems(breadCrumbItems);
    };

    return (
        <div className={styles.DashboardMain}>
            <div className={styles.Filters}>
                <div className={styles.BreadcrumbGroup}>
                    <DashboardBreadcrumbs
                        breadCrumbItems={breadCrumbItems}
                        onClick={(item, index) => {
                            console.log("index = " + index);
                            removeBreadCrumbChildren(index);
                        }}
                        onDelete={(item, index) => {
                            removeBreadCrumbChildren(index - 1);
                        }}
                    />
                </div>
                <div className={styles.DateFilterGroup}>
                    <div className={styles.DateIcon}>
                        <DateRangeIcon fontSize="large" />
                    </div>
                    <div>
                        <DateFilter
                            excludeCurrentPeriod={excludeCurrentPeriod}
                            selectedFilterOption={dateFilterOptions}
                            filterOptions={defaultDateFilterOptions}
                            customFilterName="Select a Date Range"
                            dateFilterMode="active"
                            onApply={onApplyDateFilter}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.KPIs}>
                <div
                    className={cx(styles.KPI, selectedMeasure === revenue ? styles.Active : null)}
                    onClick={(e) => changeMeasure(revenue)}
                >
                    <span className={styles.Title}>Revenue</span>
                    <Headline
                        primaryMeasure={revenue}
                        secondaryMeasure={revenuePrevious}
                        filters={dateFilter ? [dateFilter] : []}
                    />
                </div>
                <div
                    className={cx(styles.KPI, selectedMeasure === orders ? styles.Active : null)}
                    onClick={(e) => changeMeasure(orders)}
                >
                    <span className={styles.Title}>Orders</span>
                    <Headline
                        primaryMeasure={orders}
                        secondaryMeasure={ordersPrevious}
                        filters={dateFilter ? [dateFilter] : []}
                    />
                </div>
                <div
                    className={cx(styles.KPI, selectedMeasure === returnRevenue ? styles.Active : null)}
                    onClick={(e) => changeMeasure(returnRevenue)}
                >
                    <span className={styles.Title}>Return Amount</span>
                    <Headline
                        primaryMeasure={returnRevenue}
                        secondaryMeasure={returnRevenuePrevious}
                        filters={dateFilter ? [dateFilter] : []}
                    />
                </div>
                <div
                    className={cx(styles.KPI, selectedMeasure === returns ? styles.Active : null)}
                    onClick={(e) => changeMeasure(returns)}
                >
                    <span className={styles.Title}>Returns</span>
                    <Headline
                        primaryMeasure={returns}
                        secondaryMeasure={returnsPrevious}
                        filters={dateFilter ? [dateFilter] : []}
                    />
                </div>
            </div>
            <div className={styles.Chart}>
                <AreaChart
                    measures={[selectedMeasure]}
                    viewBy={chartDateGrain}
                    stackBy={filter.dimension}
                    filters={[dateFilter, filter.attributeFilter]}
                    drillableItems={
                        isDrillable()
                            ? [HeaderPredicates.localIdentifierMatch(selectedMeasure.measure.localIdentifier)]
                            : []
                    }
                    onDrill={(drillEvent) =>
                        handleDrillDown(
                            drillEvent.drillContext.intersection[2].header.attributeHeaderItem.name,
                        )
                    }
                />
            </div>
            <div className={styles.Table}>
                <PivotTable
                    measures={[Ldm.Revenue, Ldm.NrOfValidOrders, Ldm.RevenueReturns, Ldm.NrOrdersReturns]}
                    rows={
                        filter.dimension === Ldm.Product.Default
                            ? [Ldm.ProductCategory, Ldm.Product.Default]
                            : filter.dimension === Ldm.CustomerState
                            ? [Ldm.CustomerRegion, Ldm.CustomerState]
                            : [filter.dimension]
                        /*
                        filter.dimension === Ldm.ProductCategory || Ldm.ProductID ?
                            [filter.dimension]
                            : filter.dimension === Ldm.CustomerRegion
                            ? [Ldm.CustomerRegion, Ldm.CustomerState]
                            : [Ldm.CustomerState]
                         /*   
                        filter.dimension === Ldm.CustomerRegion || Ldm.CustomerState
                            ? [Ldm.CustomerRegion, Ldm.CustomerState]
                            : [filter.dimension] */
                    }
                    config={{
                        columnSizing: {
                            defaultWidth: "autoresizeAll",
                            growToFit: true,
                        },
                    }}
                    filters={[dateFilter, filter.attributeFilter]}
                    drillableItems={
                        isDrillable()
                            ? [
                                  HeaderPredicates.localIdentifierMatch(
                                      filter.dimension.attribute.localIdentifier,
                                  ),
                                  HeaderPredicates.localIdentifierMatch(revenue.measure.localIdentifier),
                                  HeaderPredicates.localIdentifierMatch(orders.measure.localIdentifier),
                                  HeaderPredicates.localIdentifierMatch(
                                      returnRevenue.measure.localIdentifier,
                                  ),
                                  HeaderPredicates.localIdentifierMatch(returns.measure.localIdentifier),
                              ]
                            : []
                    }
                    onDrill={(drillEvent) => handleDrillDown(drillEvent.drillContext.row[0].name)}
                />
            </div>
        </div>
    );
};

export default DashboardMain;
