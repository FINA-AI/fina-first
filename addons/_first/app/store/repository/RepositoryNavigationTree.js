Ext.define('first.store.repository.RepositoryNavigationTree', {
    extend: 'Ext.data.TreeStore',

    alias: 'store.repositoryNavigationTree',

    fields: [{
        name: 'text'
    }],

    root: {
        expanded: true,
        children: [
            {
                text: i18n.personalFilesMenu,
                iconCls: 'x-fa fa-folder',
                rowCls: 'nav-tree-badge nav-tree-badge-new',
                routeId: 'personalFiles',
                viewType: 'personalFiles',
                id: 'personalFiles',
                leaf: true
            },
            {
                text: i18n.fileLibrariesMenu,
                iconCls: 'x-fa fa-home',
                expanded: false,
                selectable: false,
                routeId: 'sites',

                children: [
                    {
                        text: i18n.publicLibrariesMenu,
                        iconCls: 'x-fa fa-share-alt-square',
                        viewType: 'publicsitesgrid',
                        routeId: 'publicSites',
                        parentRoute: 'sites',
                        leaf: true
                    },
                    {
                        text: i18n.myLibrariesMenu,
                        iconCls: 'x-fa fa-lock',
                        viewType: 'personalsitesgrid',
                        routeId: 'privateSites',
                        parentRoute: 'sites',
                        leaf: true
                    },
                    {
                        text: i18n.favoriteLibrairesMenu,
                        iconCls: 'x-fa fa-star',
                        viewType: 'favoritessitesgrid',
                        routeId: 'favoritesites',
                        parentRoute: 'sites',
                        leaf: true
                    }
                ]
            },
            {
                text: i18n.sharedMenu,
                iconCls: 'x-fa fa-users',
                rowCls: 'nav-tree-badge nav-tree-badge-hot',
                viewType: 'shared-files',
                routeId: 'shared',
                leaf: true
            }, {
                text: i18n.recentFilesMenu,
                iconCls: 'x-fa fa-clock',
                rowCls: 'nav-tree-badge nav-tree-badge-hot',
                viewType: 'recentfiles',
                routeId: 'recentfiles',
                leaf: true
            }, {
                text: i18n.favoritesMenu,
                iconCls: 'x-fa fa-star',
                rowCls: 'nav-tree-badge nav-tree-badge-hot',
                viewType: 'commongrid',
                routeId: 'favorites',
                leaf: true
            },
            {
                text: i18n.trashMenu,
                iconCls: 'x-fa fa-trash',
                rowCls: 'nav-tree-badge nav-tree-badge-hot',
                viewType: 'commongrid',
                routeId: 'trash',
                leaf: true
            }]
    }
});
