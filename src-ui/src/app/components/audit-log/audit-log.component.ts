import { Component, OnInit, inject, signal } from '@angular/core'
import { DatePipe } from '@angular/common'
import { NgxBootstrapIconsModule } from 'ngx-bootstrap-icons'
import { AuditLog } from 'src/app/data/audit-log'
import { AuditLogService } from 'src/app/services/rest/audit-log.service'
import { PageHeaderComponent } from '../common/page-header/page-header.component'

@Component({
  selector: 'pngx-audit-log',
  templateUrl: './audit-log.component.html',
  styleUrl: './audit-log.component.scss',
  imports: [PageHeaderComponent, NgxBootstrapIconsModule, DatePipe],
})
export class AuditLogComponent implements OnInit {
  private readonly auditLogService = inject(AuditLogService)

  readonly auditLogs = signal<AuditLog[]>([])
  readonly loading = signal(false)

  ngOnInit(): void {
    this.loadAuditLogs()
  }

  loadAuditLogs(): void {
    this.loading.set(true)

    this.auditLogService
      .list(1, 100, 'created', true)
      .subscribe({
        next: (response) => {
          this.auditLogs.set(response.results)
          this.loading.set(false)
        },
        error: () => {
          this.loading.set(false)
        },
      })
  }
}