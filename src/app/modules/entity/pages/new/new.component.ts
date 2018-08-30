import { Component, OnInit, ViewChild, NgZone, HostListener } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, FormControlName, FormArray, NgForm } from '@angular/forms';
import { MatDialog, ShowOnDirtyErrorStateMatcher, MatAutocompleteSelectedEvent } from '@angular/material';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take, debounceTime, mergeMap } from 'rxjs/operators';
import { Observable, Subject, of } from 'rxjs';
import { EntityService, Category, CategoryService, AlertifyService, CategoryMenu, UserService } from '../../../../core';
import { CustomBlob } from '../../../../shared/helpers/custom-blob';
import { MsgDialogComponent } from '../../../../shared/dialog/msg-dialog.component';
import { SuccessDialogComponent } from './components/success-dialog.component';
import { ComponentCanDeactivate } from '../../../../core/guards/can-deactivate/can-deactivate.guard';
import { ImageCropperDialogComponent } from '../../../../shared/cropper/image-cropper-dialog.component';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Entity } from '../../../../core/models/entity.model';
import { environment } from '../../../../../environments/environment';
import { HttpEventType } from '@angular/common/http';
import { AuthService } from '../../../../core/services/auth.service';
import { Globals } from '../../../../globals';

@Component({
    selector: 'app-new',
    templateUrl: './new.component.html',
    styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit, ComponentCanDeactivate {
    tinyMceInit = {
        plugins: 'link image',
        images_upload_url: 'upload.php',
        images_upload_handler: this.imgHandler,
        setup: function (editor) {
            editor.on('init', function (e) {
                console.log('This', this);
                console.log('Editor was initialized.', e);
            });
        }
    };
    baseUrl = environment.baseUrl;
    baseApiUrl = environment.baseApiUrl;
    loading: boolean;
    entityImgUrl: string;
    imageChangedEvent: any = '';
    croppedImage: any = '';
    uploadProgress;
    uploadProgressCompleted = false;
    uploading = false;
    entityForm: FormGroup;
    matcher;
    categories: CategoryMenu[];
    searchFormControl = new FormControl();
    searchKeyword: String = '';
    searchKeyword$ = new Subject<string>();
    // filteredOptions: Category[];
    @ViewChild('autosize') autosize: CdkTextareaAutosize;
    @ViewChild('form')
    form: NgForm;
    isEdit: boolean;
    entity: Entity;
    imgFormControl = new FormControl();
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
        private route: ActivatedRoute,
        private router: Router,
        private alertifyService: AlertifyService,
        private authService: AuthService,
        private userService: UserService
    ) {
        this.entityForm = this.fb.group({
            'categoryId': new FormControl('', [Validators.required]),
            'name': new FormControl('', [Validators.required]),
            'desc': new FormControl('', [Validators.required]),
            'descImages': new FormControl(''),
            'links': this.fb.array([this.createLink()]),
            'address': new FormControl(''),
            'phone': new FormControl(''),
            'email': new FormControl('', [Validators.email]),
            'Category': new FormControl('')
        });

        this.route.params
            .subscribe(
                (params: Params) => {
                    if (params && params['id']) {
                        this.loading = true;
                        this.entityService.findEntityById(params['id']).subscribe(entity => {
                            this.loading = false;
                            this.isEdit = true;
                            this.entity = entity;
                            this.entityImgUrl = entity.image ? `${this.baseUrl}/entity/${entity.id}/${entity.image}` : this.entityImgUrl;
                            this.entityForm.patchValue(entity);
                            this.entityForm.markAsPristine();
                        });
                    }
                }
            );
        this.matcher = new ShowOnDirtyErrorStateMatcher;
        this.categoryService.categories$
            .subscribe(categories => {
                this.categories = categories;
            });
        // this.categoryService.search({
        //     keyword: this.searchKeyword$,
        //     sortField: 'category',
        //     sortDirection: 'desc',
        //     pageNum: 0,
        //     pageSize: 5
        // })
        //     .subscribe(res => {
        //         this.filteredOptions = res;
        //     });
    }
    ngOnInit() {
        this.categoryService.getCategories()
            .subscribe(categories => {
                this.categories = categories;
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
    delete() {
        if (this.entity.id) {
            const dialogRef = this.dialog.open(MsgDialogComponent, {
                data: {
                    type: 'confirm',
                    msg: `Are you sure, you want to delete ${this.entity.name}?`
                },
                width: '500px',
                hasBackdrop: true,
                panelClass: ''
            });
            dialogRef.afterClosed().subscribe(resp => {
                if (resp && resp.proceed) {
                    this.entityService.delete(this.entity.id)
                        .subscribe(del => {
                            console.log('del', del);
                            if (del) {
                                this.alertifyService.success('Successfully deleted entity');
                                this.router.navigate(['entity']);
                            }
                        });
                }
            });
        }
    }
    // form submission and reset
    resetForm() {
        const fieldsVal = {
            'categoryId': '',
            'name': '',
            'desc': '',
            'links': '',
            'address': '',
            'phone': '',
            'email': '',
            'descImages': ''
        };
        this.entityForm.reset(this.isEdit ? this.entity : fieldsVal);
        this.searchFormControl.setValue('');
        this.imgFormControl.setValue('');
        this.croppedImage = '';
    }
    setEntityDescImages() {
        const str = this.entityForm.get('desc').value;
        const regex = /<img.*?src=['"](.*?)['"]/g;
        let arr;
        const outp = [];
        let filename;
        while ((arr = regex.exec(str))) {
            filename = arr[1];
            filename = filename.split('/').pop();
            if (filename) {
                outp.push(filename);
            }
        }
        this.entityForm.get('descImages').setValue(JSON.stringify(outp));
    }
    handleSubmit() {
        this.entityForm.disable();
        this.setEntityDescImages();
        const formValues = this.entityForm.value;
        console.log('formValues', formValues);
        let imageFile;
        if (this.croppedImage) {
            console.log('cropped image is', this.croppedImage);

            const blob = this.customBlob.dataURLToBlob(this.croppedImage);
            imageFile = this.customBlob.blobToFile(blob, `entity-${Date.now()}.png`);
        }

        this.loading = true;
        this.uploading = !!(this.croppedImage);
        let req;
        if (this.isEdit) {
            req = this.entityService.editEntity(
                this.entity.id,
                formValues,
                imageFile
            );
        } else {
            req = this.entityService.addNewEntity(
                formValues,
                imageFile
            );
        }
        if (req && req.progress) {
            this.uploadProgress = req.progress;
            this.uploadProgress.subscribe(end => {
                console.log('uploadProgress', end);
                this.uploadProgressCompleted = true;
                this.uploading = false;
            });
        }
        if (req && req.data) {
            req.data
                .pipe(
                    mergeMap(resp => {
                        this.userService.populate();
                        return of(resp);
                    })
                )
                .subscribe((n) => {
                    console.log('req data', n);
                    this.loading = false;
                    if (n && n.data) {
                        this.entityForm.patchValue(n.data);
                        this.entityForm.markAsPristine();
                        this.croppedImage = n.image ? `${this.baseUrl}/entity/${n.image}` : this.croppedImage;
                        this.dialog.open(SuccessDialogComponent, {
                            data: {
                                id: n.data.id || '',
                                msg: this.isEdit ? 'Saved Successfully.' : 'New Entity has been created.'
                            },
                            hasBackdrop: true,
                            width: '300px'
                        });
                    } else if (n && n.error && n.error === 'blocked') {
                        this.authService.showBlockErrPopup();
                    }
                    this.entityForm.enable();
                });
        }
    }

    imgHandler(blobInfo, success, failure) {
        let xhr, formData;

        xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.open('POST', `${this.baseApiUrl}/entities/new/image`);

        xhr.onload = function () {
            let json;

            if (xhr.status !== 200) {
                failure('HTTP Error: ' + xhr.status);
                return;
            }

            json = JSON.parse(xhr.responseText);
            json.location = `${this.baseUrl}/tmp/${json.filename}`;

            if (!json || typeof json.location !== 'string') {
                failure('Invalid JSON: ' + xhr.responseText);
                return;
            }
            success(json.location);
        };

        formData = new FormData();
        formData.append('file', blobInfo.blob(), blobInfo.filename());

        xhr.send(formData);
    }
}

