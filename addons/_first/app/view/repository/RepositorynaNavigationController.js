/**
 * Created by oto on 5/30/19.
 */
Ext.define('first.view.repository.RepositorynaNavigationController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.repositorynanavigation',

    requires: [
        'Ext.app.ViewModel',
        'Ext.data.StoreManager'
    ],

    /**
     * Called when the view is created
     */
    init: function () {
        let navigationTree = this.lookupReference('navigationTreeList');
        let navigationStore = navigationTree.getStore();
        navigationTree.setSelection(navigationStore.findRecord('id', 'personalFiles'))
    },

    listen: {
        controller: {
            '*': {
                setSelectedNode: 'onSetSelectedNode',
                mask: 'maskPanel',
                selectMenu: 'onSelectMenu'
            }
        }
    },

    onSelectMenu: function (menuNode) {
        let treeView = this.lookupReference('navigationTreeList');
        if (menuNode.get('parentRoute')) {
            treeView.getStore().findRecord('routeId', menuNode.get('parentRoute')).expand();
        }

        treeView.setSelection(treeView.getStore().findRecord('routeId', menuNode.get('routeId')));

        if (menuNode.get('selectNode')) {
            let breadcrumb = this.lookupReference(menuNode.get('routeId')).getBreadcrumb();
            this.fireEvent('expandToNode', menuNode.get('selectNode'), breadcrumb);
        }
    },

    onNavigationTreeSelectionChange: function (tree, node) {
        let panel = this.lookupReference('repositoryContentPanel');
        if (panel) {
            panel.removeAll(true);
            panel.setTitle(node.get('text'));

            let view = Ext.create({
                xtype: node.get('viewType'),
                routeId: node.get('routeId'),
                viewTitle: node.get('text'),
                reference: node.get('routeId'),
                flex: 3
            });
            this.getViewModel().set('selectedViewId', node.get('routeId'));
            this.getViewModel().set('selectedNavigationNode', node);
            panel.add(view);
        }

    },


    onMenuCreateFolderClick: function (component, e) {
        let node = this.getViewModel().get('selectedNode');

        let view = Ext.create({xtype: 'createfolderwindow'});
        view.setViewModel(new Ext.app.ViewModel())
        view.getViewModel().set('selectedNode', node);
        view.show();

    },

    onMenuUploadFileClick: function (component, e) {
        let node = this.getViewModel().get('selectedNode');
        let nodeId = '-root-';
        nodeId = node.get('id') === 'root' ? nodeId : node.get('id');

        let window = Ext.create({xtype: 'fileuploadwindow'});
        window.setViewModel(new Ext.app.ViewModel())
        window.getViewModel().set('folderNodeId', nodeId);

        window.show();
    },

    onSetSelectedNode: function (node) {
        this.getViewModel().set('selectedNode', node);
    },

    onMenuUploadFolderClick: function (component, e) {
        Ext.toast("TODO", "INFO").show();
    },


    onMenuCreateLibraryClick: function (component, e) {
        let node = this.getViewModel().get('selectedNode');

        let window = Ext.create({xtype: 'createlibrarywindow'});
        window.setViewModel(new Ext.app.ViewModel())
        window.getViewModel().set('selectedNode', node);

        window.show();
    },

    maskPanel: function (mask) {
        let contentPanel = this.lookupReference("repositoryContentPanel");
        if (mask) {
            contentPanel.mask(i18n.pleaseWait);
        } else {
            contentPanel.unmask();
        }
    },

    onSelectSearchItemClick: function (combo, node) {
        let me = this,
            view = me.getView(),
            path = node.get("path");

        if (path.name.indexOf('/documentLibrary') > 0) {
            let siteId = path.elements[2].name;
            view.mask(i18n.pleaseWait);
            Ext.Ajax.request({
                method: 'GET',
                url: first.config.Config.remoteRestUrl + 'ecm/sites/' + siteId,
                success: function (response) {
                    view.unmask();
                    let site = JSON.parse(response.responseText),
                        routeId = site.visibility === 'PRIVATE' ? 'privateSites' : 'publicSites';
                   me.onSelectMenu(Ext.create('Ext.data.TreeModel', {
                       routeId: routeId,
                       parentRoute: 'sites',
                       selectNode: node
                   }));
                },
                failure: function (response) {
                    view.unmask();
                    first.util.ErrorHandlerUtil.showErrorWindow(response);
                }
            });

        } else {
            me.onSelectMenu(Ext.create('Ext.data.TreeModel', {
                routeId: 'personalFiles',
                leaf: true,
                selectNode: node

            }));
        }
        combo.reset();
    }
});