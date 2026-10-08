import { ObjectWithId } from './object-with-id'

export interface AuditLog extends ObjectWithId {
  document_name: string
  activity: 'ADDED' | 'UPDATED' | 'DELETED'
  created: string
}