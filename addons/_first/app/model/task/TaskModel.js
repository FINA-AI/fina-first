Ext.define('first.model.task.TaskModel', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'id', type: 'string'},
        {name: 'processId', type: 'string'},
        {name: 'processDefinitionId', type: 'string'},
        {name: 'activityDefinitionId', type: 'string'},
        {name: 'name', type: 'string'},
        {name: 'description', type: 'string'},
        {name: 'dueAt', type: 'date', dateFormat: 'timestamp'},
        {name: 'startedAt', type: 'date', dateFormat: 'timestamp'},
        {name: 'endedAt', type: 'date', dateFormat: 'timestamp'},
        {name: 'durationInMs'},
        {name: 'priority'},
        {name: 'owner', type: 'string'},
        {name: 'assignee', type: 'string'},
        {name: 'formResourceKey', type: 'string'},
        {name: 'state'},
        {name: 'taskVariables'},
        {name: 'taskForm'}
    ],

    idProperty: 'id'
});