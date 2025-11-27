Ext.define('first.ux.form.field.SearchField', {
    extend: 'Ext.form.field.Text',

    xtype: 'ux-searchField',

    hideLabel: true,
    emptyText: i18n.Search,
    enableKeyEvents: true,
    triggers: {
        clear: {
            weight: 0,
            cls: Ext.baseCSSPrefix + 'form-clear-trigger',
            hidden: true,
            handler: function (textfield) {
                textfield.setValue('');
                textfield.updateSearchField(textfield);
                Ext.callback(textfield.onSearch, textfield.scope, [textfield], 0, textfield);
            }
        },
        search: {
            weight: 1,
            cls: Ext.baseCSSPrefix + 'form-search-trigger',
            handler: function (textfield) {
                textfield.updateSearchField(textfield);
                Ext.callback(textfield.onSearch, textfield.scope, [textfield], 0, textfield);
            }
        }
    },

    listeners: {
        keypress: function (textfield, op) {
            if (op.keyCode === Ext.EventObject.ENTER) {
                textfield.updateSearchField(textfield);
                Ext.callback(textfield.onSearch, textfield.scope, [textfield], 0, textfield);
            }
        }
    },

    updateSearchField: function (textfield) {
        let value = textfield.getValue();

        if (value && value.length > 0) {
            textfield.getTrigger('clear').show();
        } else {
            textfield.getTrigger('clear').hide();
        }
        textfield.updateLayout();
    }
});