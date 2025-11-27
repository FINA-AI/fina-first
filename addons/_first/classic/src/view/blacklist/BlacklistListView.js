Ext.define('first.view.blacklist.BlacklistView', {
    extend: 'Ext.grid.Panel',

    requires: [
        'Ext.layout.container.HBox',
        'Ext.toolbar.Paging',
        'Ext.toolbar.Separator',
        'Ext.util.History',
        'Ext.grid.feature.Grouping',
        'Ext.grid.filters.Filters',
        'first.store.blacklist.Blacklist',
        'first.view.blacklist.BlacklistController',
        'first.view.blacklist.BlacklistModel',
        'first.ux.plugin.filter.Date'
    ],

    xtype: 'blacklists',

    viewModel: {
        type: 'blacklist'
    },

    controller: 'blacklist',

    title: '<div><i class="fas fa-user-secret" style="margin: 2px; font-size: 18px;"></i></br>' + i18n.blacklistTitle + '</div>',
    titleAlign: 'center',

    columnLines: true,

    loadMask: true,

    bind: {
        selection: '{selectedBlacklistItem}'
    },

    store: {
        type: 'blacklists',
    },

    features: [{
        ftype: 'grouping',
        startCollapsed: false,
        groupHeaderTpl: ['{columnName}: {name} ({[values.children.length]})'],
        hideGroupedHeader: false,
    }],

    tbar: [{
        handler: function () {
            Ext.History.back();
        },
        iconCls: 'x-fa fa-arrow-left',
        cls: 'firstSystemButtons',
        hidden: true,
        bind: {
            hidden: '{nonClosableViewId ===  "blacklistPage"}'
        }
    }, {
        handler: function () {
            Ext.History.forward();
        },
        iconCls: 'x-fa fa-arrow-right',
        cls: 'firstSystemButtons',
        hidden: true,
        bind: {
            hidden: '{nonClosableViewId ===  "blacklistPage"}'
        }
    }, {
        xtype: 'tbseparator',
        hidden: true,
        bind: {
            hidden: '{nonClosableViewId ===  "blacklistPage"}'
        }
    }, {
        text: i18n.add,
        iconCls: 'x-fa fa-user-plus',
        handler: 'onAddClick',
        cls: 'finaPrimaryBtn',
        hidden: true,
        bind: {
            hidden: '{!hasBlacklistAmendPermission}'
        }
    }, {
        iconCls: 'x-fa fa-sync',
        text: i18n.refresh,
        handler: 'onRefreshClick',
        cls: 'finaSecondaryBtn'
    }, {
        flex: 1,
        xtype: 'ux-searchField',
        reference: 'searchField',
        onSearch: 'onSearch'
    },'-',{
        xtype: 'button',
        text: i18n.export,
        cls: 'finaPrimaryBtn',
        iconCls: 'x-fa fa-cloud-download-alt',
        handler: 'onBlackListExport',
        disabled: true,
        listeners: {
            afterrender: 'onBlacklistExportAfterRender'
        }
    }],


    plugins: [{
        ptype: 'cellediting',
        clicksToEdit: 1
    }, {
        ptype: 'gridfilters'
    }],

    bbar: {
        xtype: 'pagingtoolbar',
        layout: {
            type: 'hbox',
            pack: 'center'
        }
    },

    listeners: {
        select: 'onSelectBlacklistItem',
        afterrender: 'afterRender',
        edit: 'onEdit'
    }
});