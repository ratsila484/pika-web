import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { BeService } from '../../services/be/be.service';
import { PdfViewerComponent } from '../pdf-viewer/pdf-viewer.component';

@Component({
  selector: 'app-pdf-viewer-be',
  standalone: false,
  templateUrl: './pdf-viewer-be.component.html',
  styleUrl: './pdf-viewer-be.component.scss',
})
export class PdfViewerBeComponent {
  safeUrl!: SafeResourceUrl;
  numero!: string;
  pdfUrl: string | null = null;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { pdfBlob: Blob; donnee: any },
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<PdfViewerBeComponent>,
    private beService: BeService
  ) {
    // Solution: Utiliser bypassSecurityTrustResourceUrl correctement
    //this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data.url);
    const blobUrl = URL.createObjectURL(data.pdfBlob);
    this.pdfUrl = blobUrl;
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfUrl);
  }

  download() {
    this.beService.downloadPdfBE(
      this.data.pdfBlob,
      this.data.donnee.numero_doc,
      this.data.donnee
    );
    this.dialogRef.close(true);
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
