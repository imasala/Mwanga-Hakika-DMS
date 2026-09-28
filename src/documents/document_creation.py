from __future__ import annotations

from pathlib import Path

from gotenberg_client import SyncGotenbergClient
from gotenberg_client.responses import SingleFileResponse


GOTENBERG_URL = "http://gotenberg:3000"


def generate_pdf_from_html(
    html_content: str,
    output_path: Path,
) -> Path:
    """
    Convert HTML content to a PDF using Gotenberg.
    """

    output_path.parent.mkdir(parents=True, exist_ok=True)

    with SyncGotenbergClient(GOTENBERG_URL) as client:
        response = (
            client.chromium.html_to_pdf()
            .string_resource(
                html_content,
                "index.html",
                "text/html",
            )
            .output_filename(output_path.name)
            .run()
        )

    if not isinstance(response, SingleFileResponse):
        raise RuntimeError(
            "Gotenberg returned an unexpected response type."
        )

    output_path.write_bytes(response.content)

    return output_path