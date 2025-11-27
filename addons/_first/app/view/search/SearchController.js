Ext.define('first.view.search.SearchController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.search',

    init: function () {

    },

    onItemLinkClick: function (component, record, cellIndex, roIndex, e) {
        component.focus();
        e.preventDefault();

        if (e.getTarget('a')) {
            this.viewSearchedItemInTab(this.getRoute(record));

        }

        if (this.getViewModel().get('isInfoEnabled')) {
            this.showProperties(record);
        }
    },

    onInfoItemToggle: function (component, value) {
        component.setIconCls(value ? 'x-fa fa-info infoTogleSelecStyle' : 'x-fa fa-info');
        this.getViewModel().set('isInfoEnabled', value);

        if (value) {
            let record = this.getViewModel().get('selectedNode');
            this.showProperties(record);
        }
    },

    showProperties: function (record) {
        this.lookupReference('searchPropertyView').getController().loadNodeProperties(record);
    },

    getRoute: function (record) {
        let routObject = {
            route: 'repositoryItem',
            id: record.id,
            path: 'repositoryItem/' + record.id,
            node: record
        };
        let path = record.get('path');
        for (let i = 0; i < path.elements.length; i++) {
            if (path.elements[i].name === 'Registry') {
                let id = path.elements.length === i + 1 ? record.id : path.elements[i + 1].id;
                routObject = {
                    route: 'fi',
                    id: id,
                    path: 'fi/' + id
                };
                return routObject;
            }
        }

        return routObject;
    },

    viewSearchedItemInTab: function (routObject) {
        if (routObject) {
            switch (routObject.route) {
                case 'fi':
                    this.fireEvent('navChange', routObject.path);
                    break;
                case 'repositoryItem':
                    this.fireEvent('navChange', routObject.path);
                    break;
            }
        }
    }

});