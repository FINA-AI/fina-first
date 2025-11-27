Ext.define('first.view.new.dashboard.widget.chart.FiStatusByTypeChartController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fiStatusByTypeChart',

    requires: [
        'first.config.Config'
    ],

    /**
     * Called when the view is created
     */
    init: function () {
        this.getViewModel().set('fiRegistrationStatisticFilterYears', []);
        this.getViewModel().set('yearsData', {});
        this.getViewModel().set('selectedYear', new Date().getFullYear());
    },

    onFilterYearButtonClick: function () {
        let storeUrl = first.config.Config.remoteRestUrl + 'ecm/dashboard/fiRegistryStatusCount';
        let yearsData = this.getViewModel().get('yearsData');
        let me = this;
        let pressedYears = [];

        Ext.Object.each(yearsData, function (key, val) {
            if (val['isPressed']) {
                pressedYears.push(key);
            }
        });

        this.getViewModel().set('pressedYears', pressedYears);

        if (pressedYears.length > 0) {
            storeUrl += '?year=' + pressedYears.join('&year=');
        }

        let store = this.lookupReference('fiRegistrationStatisticChart').getStore();
        store.proxy.url = storeUrl;
        store.load(function (records) {
            me.getView().unmask();
        });
    },

    afterRenderFilterYearFilterBar: function (cmp) {
        let yearsData = this.getViewModel().get('yearsData');

        let currentYear = new Date().getFullYear(),
            filterYearSegmentedButtonItems = [];
        for (let i = 1980; i <= currentYear; i++) {
            yearsData[i] = {};
            yearsData[i]['isHidden'] = i < currentYear - 4;
            yearsData[i]['isPressed'] = true;

            filterYearSegmentedButtonItems.push({
                text: i,
                filterYear: i,
                bind: {
                    hidden: '{yearsData.' + i + '.isHidden}',
                    pressed: '{yearsData.' + i + '.isPressed}',
                },
                handler: 'onFilterYearButtonClick',
            });
        }

        cmp.add({
            xtype: 'button',
            enableToggle: true,
            text: i18n.all,
            isAllSelected: true,
            margin: '0 5',
            handler: 'selectAll',
            pressed: true
        })

        cmp.add({
            xtype: 'button',
            text: '<',
            handler: 'moveLeft'
        })

        cmp.add({
            xtype: 'segmentedbutton',
            allowMultiple: true,
            margin: '0 5',
            reference: 'segmentedbuttonRef',
            items: filterYearSegmentedButtonItems
        });

        cmp.add({
            xtype: 'button',
            text: '>',
            handler: 'moveRight'
        })

        this.onFilterYearButtonClick({filterYear: currentYear, pressed: true});
    },

    selectAll: function (cmp) {
        let yearsData = this.getViewModel().get('yearsData');
        cmp.isAllSelected = !cmp.isAllSelected;

        Ext.Object.each(yearsData, function (key, val) {
            val['isPressed'] = cmp.isAllSelected;
        })

        this.getViewModel().set('yearsData', yearsData);
        this.onFilterYearButtonClick();
    },

    moveRight: function () {
        let yearsData = this.getViewModel().get('yearsData');
        let selectedYear = this.getViewModel().get('selectedYear') + 1;

        if (selectedYear > new Date().getFullYear()) {
            return;
        }

        yearsData[selectedYear - 5]['isHidden'] = true;
        yearsData[selectedYear]['isHidden'] = false;

        this.getViewModel().set('selectedYear', selectedYear);
        this.getViewModel().set('yearsData', yearsData);
    },

    moveLeft: function () {
        let yearsData = this.getViewModel().get('yearsData');
        let selectedYear = this.getViewModel().get('selectedYear') - 1;

        if (selectedYear < 1980) {
            return;
        }

        yearsData[selectedYear + 1]['isHidden'] = true;
        yearsData[selectedYear - 4]['isHidden'] = false;

        this.getViewModel().set('selectedYear', selectedYear);
        this.getViewModel().set('yearsData', yearsData);
    },

    onBarChartSeriesClick: function (series, item) {
        let status = item.field,
            fiType = item.record.get('fiType');

        let filter = {
            fiRegistryLicenseStatus: status.toUpperCase(),
            types: [fiType],
            years: this.getViewModel().get('pressedYears')
        }

        let currentYear = new Date().getFullYear();
        if (filter.years.length !== currentYear - 1980 + 1) {
            if (filter.fiRegistryLicenseStatus === 'ACTIVE') {
                delete filter.fiRegistryLicenseStatus;
            }
        }

        switch (filter.fiRegistryLicenseStatus) {
            case 'INACTIVE':
                filter['fiRegistryActionType'] = ['REGISTRATION', 'CHANGE', 'BRANCHES_CHANGE', 'BRANCHES_EDIT', 'DOCUMENT_WITHDRAWAL'];
                break;
            case 'CANCELED':
                filter['fiRegistryActionType'] = ['CANCELLATION'];
                filter['fiRegistryLicenseStatus'] = 'INACTIVE';
                break;
            default:
                break;
        }

        this.fireEvent('filterFiRegistry', filter);
    }

});