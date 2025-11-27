/**
 * Created by meryc on 12.05.2020.
 */
Ext.define('first.view.registration.FiRegistryListItemContextMenuController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.fiRegistryListItemContextMenuController',

    requires: [
        'first.view.registration.reassign.ReassignTaskView'
    ],

    init: function () {

    },

    onChangeTaskAssignee: function () {
        let record = this.getView().record;
        Ext.create('first.view.registration.reassign.ReassignTaskView', {
            record: record
        }).show();
    }
});