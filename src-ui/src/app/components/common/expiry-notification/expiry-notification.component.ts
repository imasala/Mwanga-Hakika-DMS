import { Component, Input, inject } from '@angular/core'

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'

export interface ExpiryNotificationDocument {
  id: number

  title: string

  expiry_date: string

  daysRemaining: number
}

@Component({
  selector: 'pngx-expiry-notification',

  templateUrl: './expiry-notification.component.html',

  styleUrls: ['./expiry-notification.component.scss'],
})
export class ExpiryNotificationComponent {
  activeModal = inject(NgbActiveModal)

  @Input()
  expiredCount = 0

  @Input()
  expiringSoonCount = 0

  @Input()
  expiredDocuments: ExpiryNotificationDocument[] = []

  @Input()
  expiringSoonDocuments: ExpiryNotificationDocument[] = []

  dismiss(): void {
    this.activeModal.close('dismiss')
  }

  viewDocuments(): void {
    this.activeModal.close('view-documents')
  }
}