import { Component, OnInit } from '@angular/core';
import {
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { DomSanitizer } from '@angular/platform-browser';
import { UploadFileService } from 'src/app/services/api/upload-file';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => UploadFileComponent),
    },
  ],
})
export class UploadFileComponent implements OnInit {
  public files: any[] = [];
  @Input() flag: number;
  @Input() fileName: any;
  @Input() isSnapJob:boolean
  file: any;
  @Input() showDetails: boolean = true;
  @ViewChild('myFileInput') myFileInput: { nativeElement: { value: string } };
  isMp4: boolean;
  isMp4Loading: boolean;
  @Input() isRequired: boolean = false;
  @Input() isMultiple: boolean = false;
  @Input() isDownLoad: boolean = false;
  @Input() downloadURL: string;
  @Input() label: string = '';
  @Input() id = 'file-5';
  @Input() imagePersonal: any;
  @Input() acceptedExtensions: string[] = [
    'png',
    'gif',
    'jpg',
    'pdf',
    'doc',
    'docx',
    'xlsx',
    'xls',
    'iso',
    'mp3',
    'mp4',
    'vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'msword',
    'svg',
    'image/svg+xml',
    'svg+xml',
    'jpeg',
  ];

  @Output() bindValue: EventEmitter<any> = new EventEmitter<any>();

  acceptedExtensionsString: string;
  @Input() url: any;
  isImage: boolean;
  isPdf: boolean;
  isvedio: boolean;
  constructor(
    private uploadFileService: UploadFileService,
    private toastr: ToastrService,
    private spinnerService: NgxSpinnerService,
    private _sanitizer: DomSanitizer,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.url = this.imagePersonal;

    this.acceptedExtensionsString = this.acceptedExtensions.reduce(
      (str, ext) => `.${ext},${str}`,
      ''
    );
    this.isImage = this.acceptedExtensions.includes('png');
    this.isPdf = this.acceptedExtensions.includes('pdf');
    this.isvedio = this.acceptedExtensions.includes('mp4');
  }

  onSelectFile(files: FileList) {
    if (files && files[0]) {
      for (let index = 0; index < files.length; index++) {
        let fileEtenion = files[index].type.substring(
          files[index].type.indexOf('/') + 1
        );

        if (this.acceptedExtensions.includes(fileEtenion)) {
          let name = files[index].name;

          let reader = new FileReader();

          reader.readAsDataURL(files[index]); // read file as data url

          if (fileEtenion !== 'mp4' && files[index].size <= 2097152) {
            reader.onload = (event: any) => {
              let file = event.target.result;

              if (
                files[index].type ==
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                files[index].type ==
                  'vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                files[index].type == 'docx'
              ) {
                file = file.slice(84, file.length);
              }
              if (
                files[index].type == 'msword' ||
                files[index].type == 'doc' ||
                files[index].type == 'application/msword'
              ) {
                file = file.slice(31, file.length);
              }

              if (
                files[index].type == 'svg' ||
                files[index].type == 'image/svg+xml' ||
                files[index].type == 'svg+xml'
              ) {
                this.url = this.getSVGImageUrl(event.target.result);
              } else {
                this.url = event.target.result;
              }
              this.spinnerService.show();

              this.uploadFileService.UploadMyFile(file, name).subscribe(
                (res) => {
                  this.spinnerService.hide();
                  this.onChange(res.storageFileName);
                  this.bindValue.emit({
                    storageFileName: res.storageFileName,
                    fileName: name,
                  });
                  this.myFileInput.nativeElement.value = '';
                  this.fileName = name;
                },
                (err) => {
                  this.spinnerService.hide();
                }
              );
            };
          } else if (fileEtenion !== 'mp4' && files[index].size > 2097152) {
            this.spinnerService.hide();
            this.toastr.error(
              this.translate.instant('Shared.TheMaximumFileAllowed')
            );
          } else if (fileEtenion === 'mp4' && files[index].size < 31326905) {
            reader.onload = (event: any) => {
              let file = event.target.result;

              if (
                files[index].type ==
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                files[index].type ==
                  'vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                files[index].type == 'docx'
              ) {
                file = file.slice(84, file.length);
              }
              if (
                files[index].type == 'msword' ||
                files[index].type == 'doc' ||
                files[index].type == 'application/msword'
              ) {
                file = file.slice(31, file.length);
              }

              if (
                files[index].type == 'svg' ||
                files[index].type == 'image/svg+xml' ||
                files[index].type == 'svg+xml'
              ) {
                this.url = this.getSVGImageUrl(event.target.result);
              } else {
                this.url = event.target.result;
              }
              this.isMp4 = true;
              this.isMp4Loading = false;

              this.uploadFileService.UploadMyFile(file, name).subscribe(
                (res) => {
                  this.isMp4 = false;
                  this.isMp4Loading = true;
                  this.spinnerService.hide();
                  this.onChange(res.storageFileName);
                  this.bindValue.emit({
                    storageFileName: res.storageFileName,
                    fileName: name,
                  });
                  this.myFileInput.nativeElement.value = '';
                  this.fileName = name;
                },
                (err) => {
                  this.isMp4Loading = false;
                  this.isMp4 = false;
                  this.spinnerService.hide();
                }
              );
            };
          } else {
            this.spinnerService.hide();
            this.toastr.error(
              this.translate.instant('Shared.TheMaximumVedioFileAllowed')
            );
          }
        } else {
          this.spinnerService.hide();
          this.toastr.error('error');
        }
      }
    }
  }

  getSVGImageUrl(image: any) {
    let base64string = btoa(image);
    return this._sanitizer.bypassSecurityTrustUrl(
      'data:image/svg+xml;base64' + base64string
    );
  }
  onChange = (data: any) => this.writeValue(data);
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  onTouched = () => {};
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  writeValue(obj: any): void {
    Name: obj;
  }
  download() {
    window.open(this.downloadURL);
  }

  deleteImage() {
    this.url = null;
    this.fileName = null;
    this.isMp4 = false;
    this.isMp4Loading = false;

    this.bindValue.emit({ storageFileName: null, fileName: null });
  }
}
