/**
 * Created by oto on 5/30/19.
 */
Ext.define('first.store.repository.RepositoryBreadcrumbStore', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.repositoryBreadcrumbStore',

    root: {
        text: i18n.personalFilesMenu,
        expanded: true,
        children: []
    }
});