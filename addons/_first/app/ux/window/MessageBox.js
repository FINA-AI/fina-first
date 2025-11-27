Ext.define('first.ux.window.MessageBox', {
    override: 'Ext.window.MessageBox',

    makeButton: function (btnIdx) {
        let btnId = this.buttonIds[btnIdx];
        let cls = '';
        if (btnId === 'ok' || btnId === 'yes') {
            cls = 'finaPrimaryBtn'
        } else if (btnId === 'no') {
            cls = 'finaSecondaryBtn'
        }
        return new Ext.button.Button({
            handler: this.btnCallback,
            itemId: btnId,
            scope: this,
            text: this.buttonText[btnId],
            cls: cls
        });
    }
});
