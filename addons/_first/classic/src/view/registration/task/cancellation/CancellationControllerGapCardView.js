Ext.define('first.view.registration.task.cancellation.CancellationControllerGapCardView', {
    extend: 'first.view.registration.task.change.ChangeControllerGapCardView',

    xtype: 'cancellationControllerGapCard',

    requires: [
        'Ext.button.Button',
        'first.view.registration.task.cancellation.CancellationControllerGapCardController'
    ],

    controller: 'cancellationControllerGapCard'

});
