Ext.define('first.util.FiProfileUtil', {

    requires: [
        'first.config.Config'
    ],

    statics: {

        canUserAmend: function (vm) {
            let theFi = vm.get('theFi'),
                action = vm.get('fiAction'),
                currentUser = first.config.Config.conf.properties.currentUser.id,
                editor = theFi['fina_fiRegistryLastEditorId'],
                isEditor = currentUser === editor,
                isTaskInProgress = vm.get('fiRegistryStatus') === 'IN_PROGRESS';

            if (isTaskInProgress) {
                return isEditor || action['fina_fiRegistryActionExternalInitiatorIsSubmited'];
            } else {
                first.config.Config.conf.properties.currentUser.superAdmin;
            }

            return false;

        }

    }
});