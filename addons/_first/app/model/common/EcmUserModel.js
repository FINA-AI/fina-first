Ext.define('first.model.common.EcmUserModel', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'id', type: 'string'},
        {name: 'firstName', type: 'string'},
        {name: 'lastName', type: 'string'},
        {name: 'description', type: 'string'},
        {
            name: 'displayName',
            mapping: 'id',
            convert: function (v, record) {
                let firstName = record.get('firstName'),
                    lastName = record.get('lastName');

                firstName = (!firstName || firstName === 'NONAME') ? '' : firstName;
                lastName = (!lastName || lastName === 'NONAME') ? '' : lastName;
                return firstName + (lastName ? (' ' + lastName) : '') + '  (' + v + ')';
            }
        }
    ],

    idProperty: 'id'
});