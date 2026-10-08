import { Injectable } from '@angular/core'
import { AuditLog } from 'src/app/data/audit-log'
import { AbstractPaperlessService } from './abstract-paperless-service'

@Injectable({
  providedIn: 'root',
})
export class AuditLogService extends AbstractPaperlessService<AuditLog> {
  constructor() {
    super()
    this.resourceName = 'audit_logs'
  }
}