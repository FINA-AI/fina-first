Ext.define('first.view.registration.FiActionListGeneralView', {
    extend: 'first.view.registration.FiRegistrationActionListView',

    xtype: 'fiGeneralListEcm',

    requires: [
        'Ext.grid.column.Action',
        'Ext.grid.column.RowNumberer',
        'Ext.util.Format',
        'first.view.registration.FiActionGeneralListController',
        'Ext.grid.feature.Grouping'
    ],

    controller: 'fiGeneralList',

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
            align: 'left',
            flex: 2
        },
        items: [{
            flex: 0,
            xtype: 'rownumberer',
            enableGroupContext: true
        }, {
            flex: 0,
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
        }, {
            text: i18n.fiActionIdentity,
            dataIndex: 'identity',
        }, {
            text: i18n.fiActionFiNameShort,
            dataIndex: 'name',
            flex: 3,
            renderer: function (value, metaData, record) {
                let legalFormType = record.get('legalFormType');
                legalFormType = i18n[legalFormType] ? i18n[legalFormType] : '';
                return legalFormType + ' ' + value;
            }
        }, {
            text: i18n.ACTIVE,
            xtype: 'actioncolumn',
            dataIndex: 'licenseStatus',
            menuDisabled: true,
            sortable: false,
            align: 'center',
            items: [{
                getClass: function (value, meta, record, rowIx, ColIx, store, view) {
                    value = i18n[value] ? i18n[value] : value;
                    meta.tdAttr = 'data-qtip="' + i18n.licenseStatus + ': ' + value + '"';
                    if (record.get('licenseStatus') === 'ACTIVE') {
                        return 'cell-license-status-active';
                    }
                    return 'cell-license-status-inactive';
                }
            }]
        }, {
            text: i18n.taskItemGridCreatedAt,
            dataIndex: 'lastActionDate',
            renderer: Ext.util.Format.dateRenderer(first.config.Config.dateFormat),
        }, {
            text: i18n.fiProfileArchivedGapColumnTitle,
            dataIndex: 'archivedGapTaskCount',
            align: 'center',
            renderer: function (value, meta) {
                meta.tdAttr = 'data-qtip="' + i18n.archivedGapTasksTitle + ': ' + value + '"';
                let backgroundColor = (value !== 0 ? '#F44336' : '#4CAF50');
                return Ext.String.format('<span style="background-color: {0}" class="notification-icon">{1}</span>', backgroundColor, value);
            }
        }, {
            text: i18n.questionnaireFiType,
            dataIndex: 'fiTypeCode',
            hidden: true,
            flex: 1
        }, {
            text: i18n.fiAction,
            dataIndex: 'actionType',
            renderer: 'actionTypeRenderer',
        }, {
            text: i18n.fiActionStatus,
            dataIndex: 'status',
            renderer: 'statusRenderer',
        }, {
            text: i18n.fiActionAuthor,
            dataIndex: 'author',
        }, {
            text: i18n.fiActionController,
            dataIndex: 'lastInspector',
            renderer: function (value) {
                let firstName = !value || !value.firstName || value.firstName === 'NONAME' ? "" : value.firstName,
                    lastName = !value || !value.lastName || value.lastName === 'NONAME' ? "" : value.lastName;
                return value ? firstName === "" && lastName === "" ? value.id : firstName + " " + lastName : "";
            }
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