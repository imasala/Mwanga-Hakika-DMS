import {
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { NgxBootstrapIconsModule } from 'ngx-bootstrap-icons'

@Component({
  selector: 'pngx-document-creation',
  templateUrl: './document-creation.component.html',
  styleUrls: ['./document-creation.component.scss'],
  imports: [NgxBootstrapIconsModule],
})
export class DocumentCreationComponent implements OnDestroy {
  @ViewChild('editorElement')
  editorElement!: ElementRef<HTMLDivElement>

  generatedPdfUrl: string | null = null

  constructor(private http: HttpClient) {}

  private get editor(): HTMLDivElement | undefined {
    return this.editorElement?.nativeElement
  }

  private formatDocument(command: string, value?: string): void {
    if (!this.editor) return

    this.editor.focus()
    document.execCommand(command, false, value)
  }

  setParagraph(): void {
    this.formatDocument('formatBlock', 'P')
  }

  setHeading(level: 1 | 2 | 3): void {
    this.formatDocument('formatBlock', `H${level}`)
  }

  toggleBold(): void {
    this.formatDocument('bold')
  }

  toggleItalic(): void {
    this.formatDocument('italic')
  }

  toggleUnderline(): void {
    this.formatDocument('underline')
  }

  setTextAlign(
    alignment: 'left' | 'center' | 'right' | 'justify',
  ): void {
    const commands: Record<string, string> = {
      left: 'justifyLeft',
      center: 'justifyCenter',
      right: 'justifyRight',
      justify: 'justifyFull',
    }

    this.formatDocument(commands[alignment])
  }

  toggleBulletList(): void {
    this.formatDocument('insertUnorderedList')
  }

  toggleOrderedList(): void {
    this.formatDocument('insertOrderedList')
  }

  undo(): void {
    this.formatDocument('undo')
  }

  redo(): void {
    this.formatDocument('redo')
  }

  setLink(): void {
    if (!this.editor) return

    const url = window.prompt('Enter URL')

    if (url === null) return

    if (url.trim() === '') {
      this.formatDocument('unlink')
      return
    }

    const trimmedUrl = url.trim()

    if (!/^(https?:\/\/|mailto:)/i.test(trimmedUrl)) {
      window.alert('Enter a valid URL beginning with http://, https://, or mailto:')
      return
    }

    this.formatDocument('createLink', trimmedUrl)
  }

  generatePdf(): void {
    if (!this.editor) return

    const html = this.editor.innerHTML.trim()

    if (!html) {
      window.alert('Please enter document content before generating the PDF.')
      return
    }

    this.http
      .post(
        '/api/documents/create_from_html/',
        { html },
        { responseType: 'blob' },
      )
      .subscribe({
        next: (pdfBlob) => {
          if (this.generatedPdfUrl) {
            window.URL.revokeObjectURL(this.generatedPdfUrl)
          }

          this.generatedPdfUrl = window.URL.createObjectURL(pdfBlob)
          window.open(this.generatedPdfUrl, '_blank')
        },
        error: (error) => {
          console.error('Failed to generate PDF:', error)
          window.alert('Failed to generate the PDF. Check the application logs.')
        },
      })
  }

  printPdf(): void {
    if (!this.generatedPdfUrl) return

    const printWindow = window.open(this.generatedPdfUrl, '_blank')

    if (!printWindow) {
      window.alert('The browser blocked the print window. Allow pop-ups and try again.')
      return
    }

    printWindow.onload = () => printWindow.print()
  }

  newDocument(): void {
    if (!this.editor) return

    this.editor.innerHTML = ''
    this.editor.focus()

    if (this.generatedPdfUrl) {
      window.URL.revokeObjectURL(this.generatedPdfUrl)
      this.generatedPdfUrl = null
    }
  }

  ngOnDestroy(): void {
    if (this.generatedPdfUrl) {
      window.URL.revokeObjectURL(this.generatedPdfUrl)
    }
  }
}