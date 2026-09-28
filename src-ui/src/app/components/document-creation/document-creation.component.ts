import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { NgxBootstrapIconsModule } from 'ngx-bootstrap-icons'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'

@Component({
  selector: 'pngx-document-creation',
  templateUrl: './document-creation.component.html',
  styleUrls: ['./document-creation.component.scss'],
  imports: [NgxBootstrapIconsModule],
})
export class DocumentCreationComponent
  implements AfterViewInit, OnDestroy
{
  @ViewChild('editorElement')
  editorElement!: ElementRef<HTMLDivElement>

  generatedPdfUrl: string | null = null

  editor!: Editor

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.editor = new Editor({
      element: this.editorElement.nativeElement,
      extensions: [
        StarterKit,
        Underline,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        Link.configure({
          openOnClick: false,
        }),
        Placeholder.configure({
          placeholder: 'Start writing your document...',
        }),
      ],
      content: '',
    })
  }

 ngOnDestroy(): void {
  this.editor?.destroy()

  if (this.generatedPdfUrl) {
    window.URL.revokeObjectURL(
      this.generatedPdfUrl
    )
  }
}

  setParagraph(): void {
    this.editor.chain().focus().setParagraph().run()
  }

  setHeading(level: 1 | 2 | 3): void {
    this.editor
      .chain()
      .focus()
      .toggleHeading({ level })
      .run()
  }

  toggleBold(): void {
    this.editor.chain().focus().toggleBold().run()
  }

  toggleItalic(): void {
    this.editor.chain().focus().toggleItalic().run()
  }

  toggleUnderline(): void {
    this.editor.chain().focus().toggleUnderline().run()
  }

  setTextAlign(
    alignment: 'left' | 'center' | 'right' | 'justify'
  ): void {
    this.editor.chain().focus().setTextAlign(alignment).run()
  }

  toggleBulletList(): void {
    this.editor.chain().focus().toggleBulletList().run()
  }

  toggleOrderedList(): void {
    this.editor.chain().focus().toggleOrderedList().run()
  }

  undo(): void {
    this.editor.chain().focus().undo().run()
  }

  redo(): void {
    this.editor.chain().focus().redo().run()
  }

  setLink(): void {
    const url = window.prompt('Enter URL')

    if (url === null) {
      return
    }

    if (url === '') {
      this.editor.chain().focus().unsetLink().run()
      return
    }

    this.editor.chain().focus().setLink({
      href: url,
    }).run()
  }

generatePdf(): void {
  if (!this.editor) {
    return
  }

  const html = this.editor.getHTML()

  this.http
    .post(
      '/api/documents/create_from_html/',
      { html },
      {
        responseType: 'blob',
      }
    )
    .subscribe({
      next: (pdfBlob) => {
        if (this.generatedPdfUrl) {
          window.URL.revokeObjectURL(
            this.generatedPdfUrl
          )
        }

        this.generatedPdfUrl =
          window.URL.createObjectURL(pdfBlob)

        window.open(
          this.generatedPdfUrl,
          '_blank'
        )
      },

      error: (error) => {
        console.error(
          'Failed to generate PDF:',
          error
        )
      },
    })
}

printPdf(): void {
  if (!this.generatedPdfUrl) {
    return
  }

  const printWindow = window.open(
    this.generatedPdfUrl,
    '_blank'
  )

  if (!printWindow) {
    console.error(
      'The browser blocked the print window.'
    )
    return
  }

  printWindow.onload = () => {
    printWindow.print()
  }
}



  newDocument(): void {
    this.editor.commands.clearContent()
    this.editor.commands.focus()
  }
}