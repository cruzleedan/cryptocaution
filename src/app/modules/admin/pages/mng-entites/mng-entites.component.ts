import { Component, OnInit, HostListener, ViewChild, NgZone } from '@angular/core';
import { NgForm, FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialog, ShowOnDirtyErrorStateMatcher, MatAutocompleteSelectedEvent } from '@angular/material';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { Category, EntityService, CategoryService } from '../../../../core';
import { ComponentCanDeactivate } from '../../../../core/guards/can-deactivate/can-deactivate.guard';
import { CustomBlob } from '../../../../shared/helpers/custom-blob';
import { ImageCropperDialogComponent } from '../../../../shared/cropper/image-cropper-dialog.component';
import { SuccessDialogComponent } from '../../../entity/pages/new/components/success-dialog.component';

@Component({
  selector: 'app-mng-entites',
  templateUrl: './mng-entites.component.html',
  styleUrls: ['./mng-entites.component.scss']
})
export class MngEntitesComponent implements OnInit, ComponentCanDeactivate {
    imageChangedEvent: any = '';
    croppedImage: any = '';
    uploadProgress;
    uploadProgressCompleted = false;
    uploading = false;
    entityForm: FormGroup;
    matcher;
    searchFormControl = new FormControl();
    searchKeyword: String = '';
    searchKeyword$ = new Subject<string>();
    filteredOptions: Category[];
    @ViewChild('autosize') autosize: CdkTextareaAutosize;
    @ViewChild('form')
    form: NgForm;

    // @HostListener allows us to also guard against browser refresh, close, etc.
    @HostListener('window:beforeunload', ['$event'])
    canDeactivate(): Observable<boolean> | boolean {
        // insert logic to check if there are pending changes here;
        // returning true will navigate without confirmation
        // returning false will show a confirm dialog before navigating away
        return this.form.submitted || !this.form.dirty;
    }

    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private ngZone: NgZone,
        private entityService: EntityService,
        private customBlob: CustomBlob,
        private categoryService: CategoryService,
    ) {
        this.matcher = new ShowOnDirtyErrorStateMatcher;
        this.categoryService.search({
            keyword: this.searchKeyword$,
            sortField: 'category',
            sortDirection: 'desc',
            pageNum: 0,
            pageSize: 5
        })
            .subscribe(res => {
                this.filteredOptions = res;
            });
    }
    ngOnInit() {
        this.entityForm = this.fb.group({
            'categoryId': new FormControl('', [Validators.required]),
            'name': new FormControl('', [Validators.required]),
            'desc': new FormControl('', [Validators.required]),
            'links': this.fb.array([this.createLink()]),
            'address': new FormControl(''),
            'phone': new FormControl(''),
            'email': new FormControl('', [Validators.email])
        });

    }
    getControls(frmGrp: FormGroup, key: string) {
        return (<FormArray>frmGrp.get(key)).controls;
    }
    createLink(): FormGroup {
        return this.fb.group({
            link: '',
            name: ''
        });
    }
    addLink() {
        const link = this.createLink();
        this.links.push(link);
    }
    public get links(): FormArray {
        return this.entityForm.get('links') as FormArray;
    }
    removeLink(index) {
        this.links.removeAt(index);
    }
    fileChangeEvent(event: any): void {
        // this.imageChangedEvent = event;
        const dialogRef = this.dialog.open(ImageCropperDialogComponent, {
            data: {
                event: event
            },
            width: '50%'
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.croppedImage = result;
        });
    }
    imageCropped(image: string) {
        this.croppedImage = image;
    }
    imageLoaded() {
        // show cropper
    }
    loadImageFailed() {
        // show message
    }
    openCropperDialog() {
        this.dialog.open(ImageCropperDialogComponent, {
            data: {}
        });
    }
    triggerResize() {
        // Wait for changes to be applied, then trigger textarea resize.
        this.ngZone.onStable.pipe(take(1))
            .subscribe(() => this.autosize.resizeToFitContent(true));
    }
    // auto complete category input
    search(event: MatAutocompleteSelectedEvent) {
        const categoryId = event.option.value ? event.option.value['id'] : '';
        this.entityForm.get('categoryId').setValue(categoryId);
    }
    searchDisplayFn(value: any) {
        return value && value.hasOwnProperty('category') ? value['category'] : '';
    }
    // form submission and reset
    resetForm() {
        this.entityForm.reset({
            'categoryId': '',
            'name': '',
            'desc': '',
            'links': '',
            'address': '',
            'phone': '',
            'email': ''
        });
        this.searchFormControl.setValue('');
        this.croppedImage = '';
    }
    handleSubmit() {
        const formValues = this.entityForm.value;
        const blob = this.customBlob.dataURLToBlob(this.croppedImage);
        const imageFile = this.customBlob.blobToFile(blob, `entity-${Date.now()}.png`);
        this.uploading = true;
        const req = this.entityService.addNewEntity(
            imageFile,
            formValues
        );
        if (req && req.progress) {
            this.uploadProgress = req.progress;
            this.uploadProgress.subscribe(end => {
                this.uploadProgressCompleted = true;
                this.uploading = false;
            });
        }
        if (req && req.data) {
            req.data.subscribe((n) => {
                this.resetForm();
                this.dialog.open(SuccessDialogComponent, {
                    data: {
                        id: n.hasOwnProperty('id') ? n['id'] : ''
                    },
                    hasBackdrop: true,
                    width: '300px'
                });
            });
        }
    }
}

