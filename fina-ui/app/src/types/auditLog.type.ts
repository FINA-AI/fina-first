export interface AuditLogDataType {
  actorId: string;
  clientName: string;
  entityId: string;
  entityName: string;
  entityProperty: string;
  entityPropertyNewValue: string;
  entityPropertyOldValue: string;
  id: string;
  operationType: string;
  relevanceTime: number;
}
