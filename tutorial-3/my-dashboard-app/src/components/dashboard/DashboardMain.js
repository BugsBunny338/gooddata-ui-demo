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

const DashboardMain = ({ dimensionItem }) => {
    // This is used to identifiy the data set we will use for all date filtering - better explanatoin ??
    const DATASET = Ldm.DateDatasets.Date.identifier;
    const GRAIN_DAY = "GDC.time.date";
    const GRAIN_MONTH = "GDC.time.month";
    const GRAIN_QUARTER = "GDC.time.quarter";

    // We use this object to hold state on our filters for dimension selection and drill down.
    // We keep both of these in the same object so we don't trigger mutliple state updates to our child components
    // if they were kept in separate objects.
    const [attributeFilter, setAttributeFilter] = useState({
        attributeFilter: null,
        dimension: dimensionItem.dimension,
    });
    const [breadCrumbItems, setBreadCrumbItems] = useState([dimensionItem]);
    const [chartDateGrain, setChartDateGrain] = useState(Ldm.DateDatasets.Date.Month.Short);

    useEffect(() => {
        setBreadCrumbItems([dimensionItem]);
        setAttributeFilter({ attributeFilter: null, dimension: dimensionItem.dimension });
    }, [dimensionItem]);

    // We enumerate all of the measures we want to display in our headline components, as well as their corresponding previous
    // period measures.
    const revenue = Ldm.Revenue;
    const revenuePrevious = newPreviousPeriodMeasure(revenue, [{ dataSet: DATASET, periodsAgo: 1 }], m =>
        m.alias("Previous Period"),
    );

    const orders = Ldm.NrOfValidOrders;
    const ordersPrevious = newPreviousPeriodMeasure(orders, [{ dataSet: DATASET, periodsAgo: 1 }], m =>
        m.alias("Previous Period"),
    );

    const returnRevenue = Ldm.RevenueReturns;
    const returnRevenuePrevious = newPreviousPeriodMeasure(
        returnRevenue,
        [{ dataSet: DATASET, periodsAgo: 1 }],
        m => m.alias("Previous Period"),
    );

    const returns = Ldm.NrOrdersReturns;
    const returnsPrevious = newPreviousPeriodMeasure(returns, [{ dataSet: DATASET, periodsAgo: 1 }], m =>
        m.alias("Previous Period"),
    );
    const [selectedMeasure, setSelectedMeasure] = useState(revenue);

    // We use these constants to set up our date filter
    //   const availableGranularities = ["GDC.time.date", "GDC.time.month", "GDC.time.quarter", "GDC.time.year"];
    const [dateFilterOption, setDateFilterOption] = useState(defaultDateFilterOptions.allTime);
    const [excludeCurrentPeriod, setExcludeCurrentPeriod] = useState(false);

    // When the user clicks on the date filter "apply" button we execute the following:
    const onApplyDateFilter = (dateFilterOption, excludeCurrentPeriod) => {
        let grain = Ldm.DateDatasets.Date.Month.Short;
        if (
            (dateFilterOption.granularity === GRAIN_DAY && dateFilterOption.from > -32) ||
            (dateFilterOption.granularity === GRAIN_MONTH && dateFilterOption.from > -2)
        ) {
            grain = Ldm.DateDatasets.Date.Date.MmDdYyyy;
        } else if (
            (dateFilterOption.granularity === GRAIN_DAY && dateFilterOption.from > -180) ||
            (dateFilterOption.granularity === GRAIN_MONTH && dateFilterOption.from > -7) ||
            (dateFilterOption.granularity === GRAIN_QUARTER && dateFilterOption.from > -3)
        ) {
            grain = Ldm.DateDatasets.Date.WeekSunSatYear.WkQtrYear_1;
        }

        setChartDateGrain(grain);
        setDateFilterOption(dateFilterOption);
        setExcludeCurrentPeriod(excludeCurrentPeriod);
    };

    // Our date filter that will be referenced by our headline components and charts.
    // Each time this filter is reset the UI will automatically refresh.
    const dateFilter = DateFilterHelpers.mapOptionToAfm(
        dateFilterOption,
        {
            identifier: DATASET,
        },
        excludeCurrentPeriod,
    );

    const changeMeasure = measure => {
        setSelectedMeasure(measure);
    };

    const handleDrillDown = drillDimensionName => {
        // Create a new dimension grain based on current active dimension
        // (Product Category -> Product Id)
        // (Customer Region -> Customer State)
        const newDimension =
            dimensionItem.dimension === Ldm.ProductCategory ? Ldm.Product.Default : Ldm.CustomerState;

        // Create filter based on drill dimension name
        const newFilter = newPositiveAttributeFilter(attributeFilter.dimension, [drillDimensionName]);

        setAttributeFilter({ attributeFilter: newFilter, dimension: newDimension });
        setBreadCrumbItems([dimensionItem, { label: drillDimensionName, dimension: null, icon: null }]);
    };

    const isDrillable = () => {
        return (
            attributeFilter.dimension.attribute.localIdentifier ===
                Ldm.ProductCategory.attribute.localIdentifier ||
            attributeFilter.dimension.attribute.localIdentifier ===
                Ldm.CustomerRegion.attribute.localIdentifier
        );
    };

    const removeBreadCrumbChildren = parentIndex => {
        if (parentIndex === breadCrumbItems.length - 1) return;
        breadCrumbItems.splice(parentIndex + 1, breadCrumbItems.length - parentIndex);
        setAttributeFilter({ attributeFilter: null, dimension: breadCrumbItems[parentIndex].dimension });
        setBreadCrumbItems(breadCrumbItems);
    };

    return (
        <div className={styles.DashboardMain}>
            <div className={styles.Filters}>
                <div className={styles.BreadcrumbGroup}>
                    <DashboardBreadcrumbs
                        breadCrumbItems={breadCrumbItems}
                        onClick={index => {
                            removeBreadCrumbChildren(index);
                        }}
                        onDelete={index => {
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
                            selectedFilterOption={dateFilterOption}
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
                    className={cx(styles.KPI, { [styles.Active]: selectedMeasure === revenue })}
                    onClick={e => changeMeasure(revenue)}
                >
                    <span className={styles.Title}>Revenue</span>
                    <Headline
                        primaryMeasure={revenue}
                        secondaryMeasure={revenuePrevious}
                        filters={dateFilter ? [dateFilter] : []}
                    />
                </div>
                <div
                    className={cx(styles.KPI, { [styles.Active]: selectedMeasure === orders })}
                    onClick={e => changeMeasure(orders)}
                >
                    <span className={styles.Title}>Orders</span>
                    <Headline
                        primaryMeasure={orders}
                        secondaryMeasure={ordersPrevious}
                        filters={dateFilter ? [dateFilter] : []}
                    />
                </div>
                <div
                    className={cx(styles.KPI, { [styles.Active]: selectedMeasure === returnRevenue })}
                    onClick={e => changeMeasure(returnRevenue)}
                >
                    <span className={styles.Title}>Return Amount</span>
                    <Headline
                        primaryMeasure={returnRevenue}
                        secondaryMeasure={returnRevenuePrevious}
                        filters={dateFilter ? [dateFilter] : []}
                    />
                </div>
                <div
                    className={cx(styles.KPI, { [styles.Active]: selectedMeasure === returns })}
                    onClick={e => changeMeasure(returns)}
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
                    stackBy={attributeFilter.dimension}
                    filters={[dateFilter, attributeFilter.attributeFilter]}
                    drillableItems={
                        isDrillable()
                            ? [HeaderPredicates.localIdentifierMatch(selectedMeasure.measure.localIdentifier)]
                            : []
                    }
                    onDrill={drillEvent =>
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
                        attributeFilter.dimension === Ldm.Product.Default
                            ? [Ldm.ProductCategory, Ldm.Product.Default]
                            : attributeFilter.dimension === Ldm.CustomerState
                            ? [Ldm.CustomerRegion, Ldm.CustomerState]
                            : [attributeFilter.dimension]
                    }
                    config={{
                        columnSizing: {
                            defaultWidth: "autoresizeAll",
                            growToFit: true,
                        },
                    }}
                    filters={[dateFilter, attributeFilter.attributeFilter]}
                    drillableItems={
                        isDrillable()
                            ? [
                                  HeaderPredicates.localIdentifierMatch(
                                      attributeFilter.dimension.attribute.localIdentifier,
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
                    onDrill={drillEvent => handleDrillDown(drillEvent.drillContext.row[0].name)}
                />
            </div>
        </div>
    );
};

export default DashboardMain;
