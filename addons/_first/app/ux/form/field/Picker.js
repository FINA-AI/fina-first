Ext.define('first.ux.form.field.Picker', {
    override: 'Ext.form.field.Picker',

    initEvents: function () {
        this.callParent();
        let me = this;

        me.inputCell.on('click', (e) => {
            if (!me.readOnly && !me.disabled && me.editable) {
                me.expand();
            }
        });

        me.inputEl.on('focus', (e) => {
            if (e.forwardTab) {
                if (!me.readOnly && !me.disabled && me.editable) {
                    me.expand();
                }
            }
        });

        // Disable native browser autocomplete
        if (Ext.isGecko) {
            this.inputEl.dom.setAttribute('autocomplete', 'off');
        }
    },
});