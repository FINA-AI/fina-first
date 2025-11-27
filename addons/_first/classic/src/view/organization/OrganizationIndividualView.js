Ext.define('first.view.organization.OrganizationIndividualView', {
    extend: 'Ext.grid.Panel',

    requires: [
        'Ext.grid.column.Action',
        'Ext.grid.filters.Filters',
        'Ext.grid.plugin.RowExpander',
        'Ext.layout.container.HBox',
        'Ext.selection.CellModel',
        'Ext.toolbar.Paging',
        'Ext.toolbar.Separator',
        'Ext.util.Format',
        'Ext.util.History',
        'first.store.organization.OrganizationIndividualStore',
        'first.ux.form.field.SearchField',
        'first.ux.plugin.filter.Date',
        'first.view.organization.OrganizationIndividualController',
        'first.view.organization.OrganizationIndividualEditModel',
        'first.view.organization.OrganizationIndividualEditView',
        'first.view.organization.OrganizationIndividualModel'
    ],

    xtype: 'organizationIndividual',

    viewModel: {
        type: 'organizationIndividual'
    },

    controller: 'organizationIndividual',

    columnLines: true,

    loadMask: true,

    title: '<div><i class="fas fa-book" style="margin: 2px; font-size: 18px;"></i></br>' + i18n.organizationTitle + '</div>',
    titleAlign: 'center',

    bind: {
        selection: '{selectedOrganizationIndividualItem}'
    },

    store: {
        type: 'organizationIndividual',
    },

    tbar: [{
        handler: function () {
            Ext.History.back();
        },
        iconCls: 'x-fa fa-arrow-left',
        cls: 'firstSystemButtons',
        hidden: true,
        bind: {
            hidden: '{nonClosableViewId ===  "organizationIndividualPage"}'
        }
    }, {
        handler: function () {
            Ext.History.forward();
        },
        iconCls: 'x-fa fa-arrow-right',
        cls: 'firstSystemButtons',
        hidden: true,
        bind: {
            hidden: '{nonClosableViewId ===  "organizationIndividualPage"}'
        }
    }, {
        xtype: 'tbseparator',
        hidden: true,
        bind: {
            hidden: '{nonClosableViewId ===  "organizationIndividualPage"}'
        }
    }, {
        text: i18n.organizationIndividualAddOrganization,
        iconCls: 'x-fa fa-plus-circle',
        handler: 'onAddOrganizationClick',
        cls: 'finaPrimaryBtn',
        hidden: true,
        bind: {
            hidden: '{!hasOrganizationIndividualAmendPermission}'
        }
    }, {
        text: i18n.organizationIndividualAddIndividual,
        iconCls: 'x-fa fa-user-plus',
        handler: 'onAddIndividualClick',
        cls: 'finaPrimaryBtn',
        hidden: true,
        bind: {
            hidden: '{!hasOrganizationIndividualAmendPermission}'
        }
    }, {
        iconCls: 'x-fa fa-sync',
        text: i18n.refresh,
        handler: 'onRefreshClick',
        cls: 'finaSecondaryBtn'
    }, {
        xtype: 'ux-searchField',
        reference: 'searchField',
        flex: 1,
        onSearch: 'onSearch'
    }, {
        text: i18n.export,
        iconCls: 'x-fa fa-cloud-download-alt',
        cls: 'finaPrimaryBtn',
        disabled: true,
        menu: {
            items: []
        },
        listeners: {
            afterrender: 'onAfterExportButtonRender'
        }
    }],

    plugins: [{
        ptype: 'rowexpander',
        rowBodyTpl: new Ext.XTemplate(
            '<br><table style="width: 70%">',
            '<tpl if="this.isOrganization(type)">',
            '<tr>',
            '<td><b>' + i18n.organizationAndIndividualGridExpandName + ':</b> {name}</td>',
            '<td><b>' + i18n.organizationAndIndividualGridExpandPhone + ':</b> {phone}</td>',
            '</tr>',
            '<tr>',
            '<td><b>' + i18n.organizationAndIndividualGridExpandWebsite + ':</b> {website}</td>',
            '<td><b>' + i18n.organizationAndIndividualGridExpandEmail + ':</b> {email}</td>',
            '</tr>',
            '<tpl else>',
            '<tr>',
            '<td><b>' + i18n.organizationAndIndividualGridExpandName + ':</b> {name}</td>',
            '<td><b>' + i18n.organizationAndIndividualGridExpandPhone + ':</b> {phone}</td>',
            '</tr>',
            '<tr>',
            '<td><b>' + i18n.organizationAndIndividualGridExpandSurname + ':</b> {surname}</td>',
            '<td><b>' + i18n.organizationAndIndividualGridExpandEmail + ':</b> {email}</td>',
            '</tr>',
            '<tr>',
            '<td><b>' + i18n.organizationAndIndividualGridExpandGender + ':</b> {gender:this.getGender}</td>',
            '<td><b>' + i18n.organizationAndIndividualGridExpandEducation + ':</b> {education}</td>',
            '</tr>',
            '</tpl></table>',
            {
                isOrganization: function (type) {
                    return type === 'ORGANIZATION';
                },
                getGender: function (gender) {
                    return i18n[gender];
                }
            })
    }, {
        ptype: 'gridfilters'
    }],

    columns: {
        items: [{
            menuDisabled: true,
            sortable: false,
            hideable: false,
            resizable: false,
            xtype: 'actioncolumn',
            align: 'center',
            width: 60,
            items: [{
                iconCls: 'x-fa fa-edit icon-margin',
                handler: 'onEditClick',
                isDisabled: 'isEditActionDisabled'
            }, {
                iconCls: 'x-fa fa-trash',
                handler: 'onDeleteClick',
                isDisabled: 'isDeleteActionDisabled'
            }]
        }, {
            menuDisabled: true,
            sortable: true,
            hideable: false,
            resizable: false,
            xtype: 'actioncolumn',
            align: 'center',
            dataIndex: 'type',
            width: 40,
            items: [{
                iconCls: 'x-fa fa-info-circle',
                getClass: function (value, meta, record) {
                    let tooltip = i18n[value] || value;
                    meta.tdAttr = 'data-qtip="' + (tooltip ? tooltip : '') + '"';

                    let result = 'x-fa fa-university';
                    if (value !== 'ORGANIZATION') {
                        result = record.get('gender') && record.get('gender') === 'female' ? 'x-fa fa-female' : 'x-fa fa-male';
                    }

                    return result;
                }
            }]
        }, {
            flex: 1,
            text: i18n.organizationIndividualGridColumnTaxId,
            dataIndex: 'taxId',
            filter: {
                type: 'string',
                dataIndex: 'fina:organizationIndividualRegistryTaxId'
            }
        }, {
            flex: 1,
            text: i18n.organizationIndividualGridColumnPersonalId,
            dataIndex: 'personalId',
            filter: {
                type: 'string',
                dataIndex: 'fina:organizationIndividualRegistryPersonalId'
            }
        }, {
            flex: 1,
            text: i18n.organizationIndividualGridColumnStateRegOrDocNumber,
            dataIndex: 'stateRegOrDocNumber',
            filter: {
                type: 'string',
                dataIndex: 'fina:organizationIndividualRegistryStateRegistryOrDocNumber'
            }
        }, {
            flex: 1,
            align: 'center',
            text: i18n.organizationIndividualGridColumnStateRegOrBirthDate,
            dataIndex: 'stateRegOrBirthDate',
            renderer: Ext.util.Format.dateRenderer(first.config.Config.dateFormat),
            filter: {
                type: 'date',
                dataIndex: 'fina:organizationIndividualRegistryStateRegistryOrBirthDate',
                dateFormat: 'Y-m-d',
                serializer: function (filter) {
                    filter['type'] = 'DATE';
                }
            }
        }, {
            flex: 2,
            text: i18n.organizationIndividualGridColumnAddress,
            dataIndex: 'address',
            filter: {
                type: 'string',
                dataIndex: 'fina:organizationIndividualRegistryAddress'
            }
        }, {
            flex: 1,
            text: i18n.organizationIndividualGridColumnIdType,
            dataIndex: 'idType',
            renderer: function (value) {
                return i18n[value] || value;
            },
            filter: {
                type: 'list',
                labelField: 'name',
                options: [
                    {name: i18n.NATIONAL_PASSPORT, id: 'national_passport'},
                    {name: i18n.NATIONAL_ID, id: 'national_id'},
                    {displayValue: i18n.other, idType: 'other'}],
                dataIndex: 'fina:organizationIndividualRegistryIdType',
                serializer: function (filter) {
                    filter['type'] = 'LIST';
                }
            }
        }, {
            flex: 1,
            text: i18n.organizationIndividualGridColumnOrganizationForm,
            dataIndex: 'organizationalForm',
            renderer: function (value) {
                return i18n[value] || value;
            },
            filter: {
                type: 'list',
                labelField: 'name',
                options: [
                    {name: i18n.LLC, id: 'LLC'},
                    {name: i18n.OJSC, id: 'OJSC'},
                    {name: i18n.CJSC, id: 'CJSC'},
                    {name: i18n.IE, id: 'IE'}],
                dataIndex: 'fina:organizationIndividualRegistryIdOrganizationalForm',
                serializer: function (filter) {
                    filter['type'] = 'LIST';
                }
            }
        }, {
            flex: 1,
            text: i18n.organizationIndividualGridColumnAttestationStatus,
            dataIndex: 'attestationStatus',
            renderer: function (value) {
                return i18n[value] || value;
            },
            filter: {
                type: 'list',
                labelField: 'name',
                options: [
                    {id: 'underReview', name: i18n['underReview']},
                    {id: 'declined', name: i18n['declined']},
                    {id: 'recognized', name: i18n['recognized']},
                    {id: 'inQueue', name: i18n['inQueue']},
                    {id: 'inAttestationList', name: i18n['inAttestationList']},
                    {id: 'candidateApproved', name: i18n['candidateApproved']},
                    {id: 'candidateDisapproved', name: i18n['candidateDisapproved']}],
                dataIndex: 'fina:organizationIndividualRegistryAttestationStatus',
                serializer: function (filter) {
                    filter['type'] = 'LIST';
                }
            }
        }, {
            hidden: true,
            flex: 1,
            align: 'center',
            text: i18n.createdAt,
            dataIndex: 'createdAt',
            renderer: Ext.util.Format.dateRenderer(first.config.Config.timeFormat),
            filter: {
                type: 'date',
                dataIndex: 'cm:createdAt',
                dateFormat: 'Y-m-d',
                serializer: function (filter) {
                    filter['type'] = 'DATE';
                }
            }
        }, {
            hidden: true,
            flex: 1,
            align: 'center',
            header: i18n.modifiedAt,
            dataIndex: 'cm:modifiedAt',
            renderer: Ext.util.Format.dateRenderer(first.config.Config.timeFormat),
            filter: {
                type: 'date',
                dataIndex: 'modifiedAt',
                dateFormat: 'Y-m-d',
                serializer: function (filter) {
                    filter['type'] = 'DATE';
                }
            }
        }]
    },

    bbar: {
        xtype: 'pagingtoolbar',
        layout: {
            type: 'hbox',
            pack: 'center'
        }
    },

    listeners: {
        select: 'onSelectOrganizationIndividualItem',
        afterrender: 'afterRender'
    }
});