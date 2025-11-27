Ext.define('first.view.attestation.AttestationList', {
    extend: 'Ext.grid.Panel',

    requires: [
        'Ext.selection.CellModel',
        'first.store.attestation.Attestation',
        'first.view.attestation.AttestationController',
        'first.view.attestation.AttestationModel',
        'Ext.grid.plugin.RowExpander',
        'Ext.grid.filters.Filters',
        'first.ux.plugin.filter.Date',
    ],

    xtype: 'attestationsList',

    viewModel: {
        type: 'attestation'
    },

    controller: 'attestation',

    title: '<div><i class="fas fa-graduation-cap" style="margin: 2px; font-size: 18px;"></i></br>' + i18n.attestation + '</div>',
    titleAlign: 'center',


    store: {
        type: 'attestations',
        storeId: 'attestationsStore',
        remoteFilter: true
    },

    features: [{
        ftype: 'grouping',
        startCollapsed: false,
        groupHeaderTpl: ['{columnName}: {name} ({[values.children.length]})'],
        hideGroupedHeader: false,
    }],

    loadMask: true,

    columnLines: true,

    tbar: [{
        handler: function () {
            Ext.History.back();
        },
        iconCls: 'x-fa fa-arrow-left',
        cls:'firstSystemButtons',
        hidden: true,
        bind: {
            hidden: '{nonClosableViewId ===  "attestations"}'
        }
    }, {
        handler: function () {
            Ext.History.forward();
        },
        iconCls: 'x-fa fa-arrow-right',
        cls:'firstSystemButtons',
        hidden: true,
        bind: {
            hidden: '{nonClosableViewId ===  "attestations"}'
        }
    }, {
        xtype: 'tbseparator',
        hidden: true,
        bind: {
            hidden: '{nonClosableViewId ===  "attestations"}'
        }
    }, {
        xtype: 'button',
        text: i18n.attestationGenerateCandidatesListLong,
        iconCls: 'x-fa fa-cog',
        handler: 'onGenerateCandidatesListLong'
    }, {
        xtype: 'button',
        text: i18n.attestationGenerateCandidatesListShort,
        iconCls: 'x-fa fa-cog',
        handler: 'onGenerateCandidatesListShort'
    }, '-', {
        flex: 1,
        xtype: 'ux-searchField',
        reference: 'searchField',
        onSearch: 'onSearch'
    }, {
        xtype: 'button',
        text: i18n.export,
        cls: 'finaPrimaryBtn',
        iconCls: 'x-fa fa-cloud-download-alt',
        handler: 'onAttestationExport',
        disabled: true,
        listeners: {
            afterrender: 'onAttestationExportAfterRender'
        }
    }],

    plugins: [{
        ptype: 'rowexpander',
        rowBodyTpl: new Ext.XTemplate()
    }, {
        ptype: 'gridfilters'
    },{
        ptype: 'cellediting',
        clicksToEdit: 1
    }],

    listeners: {
      edit: 'onEdit'
    },

    viewConfig: {
        listeners: {
            itemclick: 'onItemClick'
        }
    },

    columns: [],

    bbar: {
        xtype: 'pagingtoolbar',
        layout: {
            type: 'hbox',
            pack: 'center'
        }
    }
});
