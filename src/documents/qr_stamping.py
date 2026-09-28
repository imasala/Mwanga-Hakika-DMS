import io
import os
import tempfile
from pathlib import Path

import pikepdf
import qrcode
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas


def generate_qr_image(qr_data: str) -> bytes:
    """
    Generate a QR code and return it as PNG bytes.
    """

    qr = qrcode.QRCode(
        version=None,
        box_size=10,
        border=2,
    )

    qr.add_data(qr_data)
    qr.make(fit=True)

    image = qr.make_image(
        fill_color="black",
        back_color="white",
    )

    buffer = io.BytesIO()

    image.save(
        buffer,
        format="PNG",
    )

    return buffer.getvalue()


def stamp_pdf_with_qr(
    pdf_path: Path,
    qr_data: str,
) -> None:
    """
    Stamp a QR code on every page of a PDF.

    The QR code is placed in the bottom-right corner.
    """

    if not pdf_path.exists():
        return

    qr_image = generate_qr_image(qr_data)

    output_path = pdf_path.with_suffix(
        f"{pdf_path.suffix}.stamped"
    )

    try:
        with pikepdf.open(pdf_path) as pdf:

            for page in pdf.pages:

                page_width = float(
                    page.mediabox[2]
                    - page.mediabox[0]
                )

                page_height = float(
                    page.mediabox[3]
                    - page.mediabox[1]
                )

                qr_size = 70
                margin = 20

                qr_x = page_width - qr_size - margin
                qr_y = margin

                overlay_buffer = io.BytesIO()

                overlay = canvas.Canvas(
                    overlay_buffer,
                    pagesize=(
                        page_width,
                        page_height,
                    ),
                )

                qr_image_buffer = io.BytesIO(
                    qr_image
                )

                overlay.drawImage(
                    ImageReader(qr_image_buffer),
                    qr_x,
                    qr_y,
                    width=qr_size,
                    height=qr_size,
                    mask="auto",
                )

                overlay.save()

                overlay_buffer.seek(0)

                with pikepdf.open(
                    overlay_buffer,
                ) as overlay_pdf:

                    page.add_overlay(
                        overlay_pdf.pages[0],
                    )

            pdf.save(
                output_path,
            )

        os.replace(
            output_path,
            pdf_path,
        )

    finally:

        if output_path.exists():
            output_path.unlink()


def stamp_document_with_qr(document) -> None:
    """
    Stamp a document with a QR code.

    Priority:

    1. Archive PDF
    2. Original PDF
    """

    qr_data = (
        f"Document ID: {document.id}\n"
        f"Document: {document.title}\n"
        f"Created: {document.created.isoformat()}"
    )

    if (
        document.has_archive_version
        and document.archive_path is not None
        and document.archive_path.exists()
    ):
        stamp_pdf_with_qr(
            document.archive_path,
            qr_data,
        )

        return

    if (
        document.mime_type == "application/pdf"
        and document.source_path.exists()
    ):
        stamp_pdf_with_qr(
            document.source_path,
            qr_data,
        )