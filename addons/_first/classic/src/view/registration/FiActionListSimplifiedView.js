Ext.define('first.view.registration.FiActionListSimplifiedView', {
    extend: 'first.view.registration.FiRegistrationActionListView',

    xtype: 'fiSimplifiedListEcm',

    requires: [
        'Ext.grid.column.Action',
        'Ext.grid.column.RowNumberer',
        'Ext.grid.feature.Grouping',
        'Ext.util.Format',
        'first.view.registration.FiActionSimplifiedListController'
    ],

    controller: 'fiSimplifiedList',

    emptyText: i18n.gridDefaultEmptyText,

    viewConfig: {
        loadMask: true,
        getRowClass: function (record, index, rowParams) {
            if (record.get('isHistoricData')) {
                return 'historic-data';
            }
            if (record.get('licenseStatus') === 'INACTIVE') {
                switch (record.get('cancellationReason')) {
                    case 'basedOnApplication':
                        return 'disabled-with-sanction-row';
                    case 'basedOnCheckup':
                        return 'disabled-with-application-row';
                }
            }
        }
    },

    border: true,

    columnLines: true,
    header: false,


    columns: {
        defaults: {
            align: 'left'
        },
        items: [{
            flex: 0,
            xtype: 'rownumberer',
            enableGroupContext: true
        }, {
            width: 50,
            menuDisabled: true,
            sortable: false,
            hideable: false,
            resizable: false,
            xtype: 'actioncolumn',
            align: 'center',
            items: [{
                iconCls: 'x-fa fa-edit',
                tooltip: i18n.fiRegistrationViewFI,
                handler: 'onFiClick'
            }]
        }, {
            text: i18n.fiActionFiCode,
            dataIndex: 'code',
            flex: 3,
        }, {
            text: i18n.fiActionFiNameShort,
            dataIndex: 'name',
            flex: 3
        }, {
            text: i18n.legalFormType,
            dataIndex: 'legalFormType',
            flex: 3,
            renderer: function (value) {
                return i18n[value] ? i18n[value] : value;
            }
        }, {
            text: i18n.legalActNumber,
            dataIndex: 'lastLegalActNumber',
            flex: 5,
        }, {
            text: i18n.legalActDate,
            dataIndex: 'lastLegalActDate',
            flex: 5,
            renderer: Ext.util.Format.dateRenderer(first.config.Config.dateFormat)
        }, {
            text: i18n.region,
            dataIndex: 'legalAddressRegion',
            flex: 2,
        }, {
            text: i18n.city,
            dataIndex: 'legalAddressCity',
            flex: 2,
        }, {
            text: i18n.address,
            dataIndex: 'legalAddress',
            flex: 3,
        }, {
            text: i18n.identificationCodes,
            dataIndex: 'identity',
            flex: 5,
        }, {
            text: i18n.directorFullName,
            dataIndex: 'directorFullName',
            flex: 5
        }]
    },

    features: [{
        ftype: 'grouping',
        groupHeaderTpl: '{columnName}: {name} ({rows.length})'
    }],

    listeners: {
        afterrender: 'afterFiRegistryGridRender',
        itemcontextmenu: 'onOpenItemContextMenu'
    }
});