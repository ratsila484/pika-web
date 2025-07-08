import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BeService } from '../../services/be/be.service';
import { PlatformState } from '@angular/platform-server';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-pdf-viewer',
  standalone: false,
  templateUrl: './pdf-viewer.component.html',
  styleUrl: './pdf-viewer.component.scss',
})
export class PdfViewerComponent {
  safeUrl!: SafeResourceUrl;
  numero!: string;
  pdfUrl: string | null = null;
  user!: string;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { pdfBlob: Blob; donnee: any },
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<PdfViewerComponent>,
    private beService: BeService,
    @Inject(PLATFORM_ID) private plateformId: Object
  ) {
    // Solution: Utiliser bypassSecurityTrustResourceUrl correctement
    //this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data.url);
    const blobUrl = URL.createObjectURL(data.pdfBlob);
    this.pdfUrl = blobUrl;
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfUrl);
    
  }

  download() {
    this.beService.downloadPdfPs(
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
