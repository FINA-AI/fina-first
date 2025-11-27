Ext.define('first.view.search.SearchView', {
    extend: 'Ext.panel.Panel',

    xtype: 'search',

    requires: [
        'Ext.container.Container',
        'Ext.layout.container.Anchor',
        'Ext.layout.container.Fit',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'Ext.toolbar.Paging',
        'Ext.toolbar.Separator',
        'Ext.util.History',
        'Ext.ux.form.SearchField',
        'Ext.view.View',
        'first.store.search.SearchStore',
        'first.util.RepositoryUtil',
        'first.view.repository.common.PropertyView',
        'first.view.search.SearchController',
        'first.view.search.SearchViewModel'
    ],

    controller: 'search',

    viewModel: {
        type: 'searchViewModel'
    },

    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    border: true,

    title: i18n.Search,

    config: {
        store: Ext.create('first.store.search.SearchStore')
    },

    tbar: {
        cls: 'firstFiRegistryTbar',
        items: [{
            handler: function () {
                Ext.History.back();
            },
            iconCls: 'x-fa fa-arrow-left',
            cls: 'firstSystemButtons',
            hidden: true,
            bind: {
                hidden: '{nonClosableViewId ===  "search"}'
            }
        }, {
            handler: function () {
                Ext.History.forward();
            },
            iconCls: 'x-fa fa-arrow-right',
            cls: 'firstSystemButtons',
            hidden: true,
            bind: {
                hidden: '{nonClosableViewId ===  "search"}'
            }
        }, {
            xtype: 'tbseparator',
            hidden: true,
            bind: {
                hidden: '{nonClosableViewId ===  "search"}'
            }
        }, {
            iconCls: 'x-fa fa-info',
            reference: 'infoTogleButton',
            tooltip: i18n.properties,
            enableToggle: true,
            toggleHandler: 'onInfoItemToggle',
            hidden: true,
            bind: {
                hidden: '{isSelectedNode}'
            }
        }, {
            flex: 1,
            fieldLabel: i18n.Search,
            reference: 'searchField',
            labelWidth: 50,
            xtype: 'searchfield',
            store: 'searchStore',
            emptyText: i18n.Search

        }]
    },

    items: [{
        scrollable: 'y',
        xtype: 'dataview',
        flex: 3,
        reference: 'searchDataView',
        cls: 'dataview-inline',
        itemSelector: 'div.search-item',
        emptyText: '<div class="x-grid-empty emptyText">' + i18n.searchNoMatchingItems + '</div>',
        store: 'searchStore',
        listeners: {
            itemclick: 'onItemLinkClick',
        },

        bind: {
            selection: '{selectedNode}'
        },
        tpl: [
            '<tpl for=".">',
            '<div class="search-item">',
            '<div class="item-icon">{id:this.setIcon}</div>',
            '<div class="item-info">' +
            '<a href="#">{id:this.formatName}</a>',
            '<span>|' + i18n.taskItemGridLocation + ': ' +
            '<span title="{path.name}" style="cursor: pointer"><b>{path:this.setLocation}</b></span>' +
            '</span>' +
            '<tpl if="classProperties && properties">',
            '<p class="paragraphStyle">{id:this.showDetails}</p>' +
            '</tpl>' +
            '<h3><span>' + i18n.taskItemGridCreatedAt + ': {createdAt:this.formatDate} | ' +
            i18n.taskItemGridModifiedBy + ': <b>{modifiedBy:this.displayUser}</b></span></h3>',
            '</div>' +
            '</div>',
            '</tpl>',

            {
                formatDate: function (value) {
                    return Ext.Date.format(new Date(Number(value)), 'Y-m-d');
                },

                displayUser: function (modifiedByUser) {
                    return modifiedByUser ? modifiedByUser.displayName : "SYSTEM";
                },

                setIcon: function (id) {
                    let record = this.owner.getStore().findRecord('id', id);
                    return first.util.RepositoryUtil.getNodeIcon(record, 'fa-2x');
                },

                setLocation: function (path) {
                    if (path.name) {
                        return path.name.lastIndexOf('/') === 0 ? "Personal Files" : path.name.substring(path.name.lastIndexOf('/') + 1, path.name.length);
                    }
                    return 'Personal Files';
                },

                showDetails: function (id) {
                    let record = this.owner.getStore().findRecord('id', id);
                    let value = '';
                    let classProperties = record.get('classProperties');
                    let properties = record.get('properties');

                    let tpl = new Ext.Template('<span style="cursor: pointer"  title="{title}">{name}</span>');

                    let propCount = 0;

                    Ext.each(classProperties, function (prop, index) {
                        if (prop['title'] && properties[prop['name']] && properties) {
                            propCount++;
                            if (propCount > 20) {
                                return;
                            }

                            let propertyValue = properties[prop['name']];
                            if (prop['dataType'] === 'd:boolean') {
                                propertyValue = propertyValue ? i18n.yes : i18n.no;
                            }
                            if (prop['constraints'].length > 0) {
                                Ext.each(prop['constraints'], function (constraint) {
                                    if (constraint.type === 'LIST') {
                                        const v = properties[prop['name']];
                                        propertyValue = i18n[v] ? i18n[v] : v;
                                    }
                                });
                            }

                            let text = tpl.apply({title: prop['title'], name: propertyValue});
                            if (prop['dataType'] === 'd:date') {
                                let formattedDate = Ext.Date.format(new Date(properties[prop['name']]), 'Y-m-d');
                                text = tpl.apply({title: prop['title'], name: formattedDate});
                            }
                            value += text + (classProperties.length - 1 === index ? '' : ', ');
                        }
                    });

                    let filter = this.owner.getStore().getFilters().getByKey('query').getValue();
                    let regEx = new RegExp(filter, "ig");
                    value = value.replace(regEx, '<mark>' + filter + '</mark>');
                    return propCount > 20 ? value + '...' : value;
                },

                formatName: function (id) {
                    let record = this.owner.getStore().findRecord('id', id);
                    let value = record.get('name');
                    if (record.get('nodeType').startsWith("nbg:") || record.get('nodeType').startsWith("nbt:") || record.get('nodeType').startsWith("fina:")) {
                        let path = record.get('path');
                        switch (record.get('nodeType').split(':')[1]) {
                            case 'fiRegistry':
                                value += ' - ' + record.get('properties')['fina:fiRegistryName'];
                                break;
                            case 'fiRegistryBranch':
                                value = getNameByPath(path) + ' Branch';
                                break;
                            case 'fiBeneficiary':
                                value = getNameByPath(path) + ' Beneficiary';
                                break;
                            case 'fiRegistryActionQuestionnaire':
                                value = getNameByPath(path) + ' Questionnaire';
                                break;
                            case 'fiAuthorizedPerson':
                                value = getNameByPath(path) + ' Authorized Person';
                                break;
                        }
                    }

                    function getNameByPath(path) {
                        for (let i = 0; i < path.elements.length; i++) {
                            if (path.elements[i].name === 'Registry') {
                                return path.elements[i + 1].name;
                            }
                        }
                    }

                    let filter = this.owner.getStore().getFilters().getByKey('query').getValue();
                    let regEx = new RegExp(filter, "ig");

                    return value.replace(regEx, '<mark>' + filter + '</mark>');
                }
            }]
    }, {
        xtype: 'property',
        reference: 'searchPropertyView',
        flex: 1,
        hidden: true,
        title: i18n.properties,
        bind: {
            hidden: '{hidePropertyPanel}'
        }
    }],


    bbar: {
        xtype: 'pagingtoolbar',
        layout: {
            type: 'hbox',
            pack: 'center'
        }
    }


});
