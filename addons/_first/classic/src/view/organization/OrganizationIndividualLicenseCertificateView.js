Ext.define('first.view.organization.OrganizationIndividualLicenseCertificateView', {
    extend: 'Ext.grid.Panel',

    requires: [
        'Ext.selection.CellModel',
        'first.store.organization.OrganizationIndividualLicenseCertificateStore',
        'first.view.organization.OrganizationIndividualLicenseCertificateModel',
        'first.view.organization.OrganizationIndividualLicenseCertificateController'
    ],

    xtype: 'organizationIndividualLicenseCertificate',

    viewModel: {
        type: 'organizationIndividualLicenseCertificate'
    },

    controller: 'organizationIndividualLicenseCertificate',


    title: '<div><i class="fas fa-book" style="margin: 2px; font-size: 18px;"></i></br>' + i18n.organizationIndividualLicenseCertificateListTitle + '</div>',
    titleAlign: 'center',

    columnLines: true,

    loadMask: true,

    bind: {
        selection: '{selectedOrganizationIndividualLicenseCertificateItem}'
    },

    store: {
        type: 'organizationIndividualLicenseCertificate',
    },

    tbar: [{
        text: i18n.add,
        iconCls: 'x-fa fa-plus-circle',
        handler: 'onAddClick',
        cls: 'finaPrimaryBtn',
        hidden: true,
        disabled: true,
        bind: {
            hidden: '{!hasOrganizationIndividualAmendPermission}',
            disabled: '{!enableTbarItems}'
        }
    }, {
        iconCls: 'x-fa fa-sync',
        text: i18n.refresh,
        handler: 'onRefreshClick',
        cls: 'finaSecondaryBtn',
        disabled: true,
        bind: {
            disabled: '{!enableTbarItems}'
        }
    },{
        xtype: 'ux-searchField',
        reference: 'searchField',
        flex: 1,
        onSearch: 'onSearch'
    }],

    columns: {
        defaults: {
            flex: 0
        },
        items: [{
            flex: 0,
            menuDisabled: true,
            sortable: false,
            hideable: false,
            resizable: false,
            xtype: 'actioncolumn',
            align: 'center',
            items: [{
                iconCls: 'x-fa fa-edit',
                handler: 'onEditClick',
                isDisabled: 'isEditActionDisabled'
            },' ',
                {
                    iconCls: 'x-fa fa-trash',
                    handler: 'onDeleteClick',
                    isDisabled: 'isDeleteActionDisabled'
                }]
        }, {
            flex: 1,
            text: i18n.organizationIndividualLicenseCertificateGridColumnUniqueNumber,
            dataIndex: 'uniqueNumber'
        }, {
            flex: 1,
            text: i18n.organizationIndividualLicenseCertificateGridColumnStatus,
            dataIndex: 'status',
            renderer: function (value) {
                let color = (value === 'ACTIVE' ? 'green' : 'red');
                return Ext.String.format('<span style="color: {0};"><b>{1}</b></span>', color, i18n[value] || value);
            }
        }, {
            flex: 1,
            align: 'center',
            text: i18n.organizationIndividualLicenseCertificateGridColumnIssueDate,
            dataIndex: 'issueDate',
            renderer: Ext.util.Format.dateRenderer(first.config.Config.dateFormat)
        }, {
            flex: 1,
            text: i18n.organizationIndividualLicenseCertificateGridColumnResolutionDocNumber,
            dataIndex: 'resolutionDocNumber'
        }, {
            flex: 1,
            text: i18n.organizationIndividualLicenseCertificateGridColumnType,
            dataIndex: 'type',
            renderer: function (v) {
                return v['name'];
            }
        }, {
            flex: 1,
            align: 'center',
            text: i18n.organizationIndividualLicenseCertificateGridColumnExpirationDate,
            dataIndex: 'expirationDate',
            renderer: Ext.util.Format.dateRenderer(first.config.Config.dateFormat)
        }, {
            flex: 1,
            align: 'center',
            text: i18n.organizationIndividualLicenseCertificateGridColumnSuspendWithdrawDate,
            dataIndex: 'suspendDate',
            renderer: Ext.util.Format.dateRenderer(first.config.Config.dateFormat)
        }, {
            flex: 1,
            text: i18n.organizationIndividualLicenseCertificateGridColumnSuspendWithdrawReason,
            dataIndex: 'suspendReason'
        }, {
            flex: 1,
            hidden: true,
            align: 'center',
            text: i18n.createdAt,
            dataIndex: 'createdAt',
            renderer: Ext.util.Format.dateRenderer(first.config.Config.timeFormat)
        }, {
            flex: 1,
            hidden: true,
            align: 'center',
            header: i18n.modifiedAt,
            dataIndex: 'modifiedAt',
            renderer: Ext.util.Format.dateRenderer(first.config.Config.timeFormat)
        }]
    },

    bbar: {
        xtype: 'pagingtoolbar',
        layout: {
            type: 'hbox',
            pack: 'center'
        },
        disabled: true,
        bind: {
            disabled: '{!enableTbarItems}'
        }
    }

});