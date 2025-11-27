Ext.define('first.view.registration.task.shared.CardHeaderView', {
    extend: 'Ext.form.Label',
    xtype: 'cardHeader',

    requires: [
        'first.view.registration.task.shared.CardHeaderController'
    ],

    controller: 'cardHeaderController',

    labelWidth: '100%',
    editable: false,
    bind: {
        html: '<b>{headerData.label}</b> <b style="float: right">{headerData.info}</b>'
    },
    margin: 10

});