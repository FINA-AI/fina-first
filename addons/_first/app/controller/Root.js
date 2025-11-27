Ext.define('first.controller.Root', {
    extend: 'Ext.app.Controller',

    requires: [
        'Ext.data.Session',
        'first.config.Config',
        'first.view.new.main.Main'
    ],

    listen: {
        controller: {
            '*': {
                navChange: 'onNavChange',
            }
        }
    },

    config: {
        routes: {
            ':id': {
                action: 'handleRoute',
                before: 'beforeHandleRoute'
            },
            'fi/:id': {
                action: 'handleFi',
                before: 'beforeHandleRoute'
            },
            'fi/:fiId/:property': {
                action: 'handleFi'
            },
            'fi/:fiId/:property/:itemId': {
                action: 'handleFi'
            },
            'wfDetails/:id': {
                action: 'handleWorkflowDetails',
                before: 'beforeHandleRoute'
            },
            'wfCreateNew/:processDefinitionKey': {
                action: 'handleWorkflowCreateNew',
                before: 'beforeHandleRoute'
            },
            'wfCreateNew/:processDefinitionKey/:property': {
                action: 'handleWorkflowCreateNew'
            },
            'taskItemEdit/:id': {
                action: 'handleTaskItemEdit',
                before: 'beforeHandleRoute'
            },
            'taskItemView/:id': {
                action: 'handleTaskItemView',
                before: 'beforeHandleRoute'
            },
            'repositoryItem/:id': {
                action: 'handleRepositoryItemView',
                before: 'beforeHandleRoute'
            },
            'fis/:externalData': {
                action: 'handleFis',
                before: 'beforeHandleRoute'
            }
        }
    },

    onPanelRendered: function () {
        this.firstLoadRoute();
    },

    beforeHandleRoute: function (id, action) {

        //TODO check route

        //resume action
        action.resume();
    },

    handleRoute: function (id) {
        this.fireEvent('openTab', id);
    },

    handleFi: function (id, property, recordId) {
        this.fireEvent('openTab', 'fi', id, property, recordId);
    },

    handleFis: function (externalData) {
        this.fireEvent('openTab', 'fis', null, externalData);
    },

    handleWorkflowDetails: function (id) {
        this.fireEvent('openTab', 'workflowDetails', id);
    },

    handleWorkflowCreateNew: function (processDefinitionKey, property) {
        this.fireEvent('openTab', 'workflowCreateNew', processDefinitionKey, property);
    },

    handleTaskItemEdit: function (id) {
        this.fireEvent('openTab', 'taskItemEdit', id);
    },

    handleTaskItemView: function (id) {
        this.fireEvent('openTab', 'taskItemView', id);
    },

    handleRepositoryItemView: function (id) {
        this.fireEvent('openTab', 'repositoryItem', id);
    },

    onNavChange: function (id, property) {
        let token = id + (property ? '/' + property : '');
        this.redirectTo(token, true);
    },

    onLaunch: function () {
        if (Ext.isIE8) {
            Ext.Msg.alert('Not Supported', 'This example is not supported on Internet Explorer 8. Please use a different browser.');
            return;
        }

        this.session = new Ext.data.Session({
            autoDestroy: false
        });

        let me = this;

        Ext.Ajax.request({
            url: first.config.Config.remoteRestUrl + 'config',
            method: 'GET',
            callback: function (options, success, response) {
                if (success) {
                    const obj = Ext.decode(response.responseText);
                    if (!obj || !obj.properties || !obj.properties.isEcmEnable) {
                        me.onFirstIsNotAvailable();
                        return;
                    }

                    first.config.Config.conf = obj;
                    if (obj.properties.currentUser.capabilities && obj.properties.currentUser.capabilities.admin) {
                        first.config.Config.conf.properties.userRootNode.id = '-root-';
                    }
                    me.onLogin(obj);

                } else {
                    me.onFirstIsNotAvailable();
                }
            }
        });
    },

    firstLoadRoute: function () {

        let hash = window.location.hash;

        if (!hash) {
            hash = "home";
        } else {
            hash = hash.split('?')[0].replace("#", "");
        }

        this.onNavChange(hash);
    },

    onLogin: function (user, organization, menu) {

        this.viewport = new first.view.new.main.Main({
            session: this.session,
            viewModel: {
                data: {
                    currentMenu: menu,
                    nonClosableViewId: this.findNonClosableViewIdParam()
                },
                formulas: {
                    hasConfigReviewPermission: function (get) {
                        let permissions = first.config.Config.conf['permissions'];
                        return (permissions && Ext.Array.contains(permissions, 'net.fina.first.config.review'));
                    },
                    hasConfigAmendPermission: function (get) {
                        let permissions = first.config.Config.conf['permissions'];
                        return (permissions && Ext.Array.contains(permissions, 'net.fina.first.config.amend'));
                    },
                }
            }
        });

        Ext.get("loadingIndicator").remove();

        this.firstLoadRoute();
    },

    findNonClosableViewIdParam: function () {
        let properties = window.location.hash.split('?')[1]

        if (properties) {
            let nonClosableViewIdParam = properties
                .split('&')
                .find(el => el.split('=')[0] === 'nonClosableViewId')
            if (nonClosableViewIdParam) {
                return nonClosableViewIdParam.split('=')[1];
            }
        }

        return null;
    },

    onFirstIsNotAvailable: function () {
        this.viewport = new first.view.page.FirstIsNotAvailablePageView();
        Ext.get("loadingIndicator").remove();
    }

});
