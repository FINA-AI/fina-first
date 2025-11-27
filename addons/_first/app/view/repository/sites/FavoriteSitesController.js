/**
 * Created by oto on 6/7/19.
 */
Ext.define('first.view.repository.sites.FavoriteSitesController', {
    extend: 'first.view.repository.sites.PrivateSitesController',
    alias: 'controller.favoritesites',

    /**
     * Called when the view is created
     */
    init: function () {
        this.callParent(arguments);
    },


    onBreadCrumbNavigationClick: function (component, node, prevNode) {
        this.callParent(arguments);
    },

    onCellClick: function (component, td, cellIndex, record, tr, rowIndex, e) {
        this.callParent(arguments);
    },

    getContextMenu: function (record) {
        var me = this;
        if (!me.getViewModel().get('isRoot')) {
            return this.callParent(arguments);
        }

        return Ext.create('Ext.menu.Menu', {
            controller: 'commoncontextmenu',
            viewModel: me.getViewModel(),
            record: record,
            items: [{
                text: i18n.leaveLibrary,
                iconCls: 'x-fa fa-sign-out-alt',
                handler: 'onLeaveLibraryMenuClick',
                bind: {
                    disabled: '{isUserNodeOwner}'
                }

            }, {
                xtype: 'menuseparator'
            }, {
                text: i18n.removeFromFavorites,
                handler: 'onRemoveFavoriteLibraryMenuClick',
                iconCls: 'x-fa fa-times',
                disabled: true,
                bind: {
                    disabled: '{!selectedDocument}'
                }
            }, {
                xtype: 'menuseparator'
            }, {
                text: i18n.members,
                handler: 'onMembersMenuClick',
                iconCls: 'x-fa fa-list',
                disabled: true,
                bind: {
                    disabled: '{!(isUserNodeOwner || isUserAdministrator)}'
                }
            }]
        });
    },
});