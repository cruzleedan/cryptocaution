import { Component, OnInit, NgZone, HostListener, ViewChild, Input } from '@angular/core';
import { ImageCropperDialogComponent } from '../../../../../../shared/cropper/image-cropper-dialog.component';
import { Observable, of } from 'rxjs';
import { take, map, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { FormControl, Validators, FormBuilder, NgForm, FormGroup, AbstractControl } from '@angular/forms';
import { ShowOnDirtyErrorStateMatcher, MatDialog, MatIconRegistry } from '@angular/material';
import { AlertifyService, UserService, User, Category, CategoryService } from '../../../../../../core';
import { ValidationMessage } from '../../../../../../core/validators/validation.message';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CustomBlob } from '../../../../../../shared/helpers/custom-blob';
import { MatIcons } from '../../../../../../shared/helpers/mat-icons';


@Component({
    selector: 'app-categories-form',
    templateUrl: './categories-form.component.html',
    styleUrls: ['./categories-form.component.scss']
})
export class CategoriesFormComponent implements OnInit {

    @Input() category: Category;
    imageChangedEvent: any = '';
    croppedImage: any = '';
    uploadProgress;
    uploadProgressCompleted = false;
    uploading = false;
    submitting: boolean;
    categoryForm: FormGroup;
    matcher;
    icons;
    @ViewChild('autosize') autosize: CdkTextareaAutosize;
    @ViewChild('form')
    form: NgForm;
    validationMessages = ValidationMessage.msg;


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
        private customBlob: CustomBlob,
        private matIcons: MatIcons,
        private ngZone: NgZone,
        private categoryService: CategoryService,
        private alertifyService: AlertifyService,
        private iconRegistry: MatIconRegistry
    ) {
        this.matcher = new ShowOnDirtyErrorStateMatcher;
        this.categoryForm = this.fb.group({
            'category': new FormControl('', [Validators.required]),
            'icon': new FormControl('')
        });
        this.icons = this.matIcons.getIcons();
    }
    ngOnInit() {
        if (this.category) {
            console.log('Patch category form with ', this.category);

            this.categoryForm.patchValue(this.category);
        }
        const categoryCtrl = this.categoryForm.controls['category'];
        categoryCtrl.valueChanges.pipe(
            debounceTime(500), // replaces your setTimeout
            map(category => {
                category = category.trim();
                const isChanged = category && category !== this.category.category;
                console.log('current ', category, ' category ', this.category.category, ' ', isChanged);
                return isChanged ? category : false;
            }),
            distinctUntilChanged(), // wait until it's different than what we last checked
            switchMap(desiredcategory => this.categoryService.checkCategoryNameNotTaken(desiredcategory)),
            tap(exists => {
                if (exists) {
                    categoryCtrl.setErrors({ categoryTaken: true });
                } else if (categoryCtrl.errors && categoryCtrl.errors.hasOwnProperty('categoryNameTaken')) {
                    delete categoryCtrl.errors.categoryNameTaken;
                }
            })
        ).subscribe();
    }
    fileChangeEvent(event: any): void {
        // this.imageChangedEvent = event;
        console.log('fileChangeEvent fired!');

        const dialogRef = this.dialog.open(ImageCropperDialogComponent, {
            data: {
                event: event
            },
            width: '50%',
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
    // form submission and reset
    resetForm() {
        this.categoryForm.reset({
            'category': '',
            'icon': ''
        });
        this.croppedImage = '';
        this.categoryForm.patchValue(this.category);
    }
    handleSubmit() {
        this.submitting = true;
        const formValues = this.categoryForm.value;
        console.log('Submit category form', formValues);
        let imageFile;
        if (this.croppedImage) {

            const blob = this.customBlob.dataURLToBlob(this.croppedImage);
            imageFile = this.customBlob.blobToFile(blob, `avatar-${Date.now()}.png`);
        }
        const req = this.categoryService.updateCategory(
            this.category.id,
            this.croppedImage ? imageFile : null,
            formValues
        );
        this.uploading = true;
        if (req && req.progress) {
            this.uploadProgress = req.progress;
            this.uploadProgress.subscribe(end => {
                this.uploadProgressCompleted = true;
                this.uploading = false;
            });
        }
        if (req && req.data) {
            req.data.subscribe((resp) => {
                this.resetForm();
                console.log('Patch category form with ', resp['data']);
                this.categoryForm.patchValue(resp['data']);
                this.alertifyService.success('Successfully saved!');
                this.submitting = false;
            });
        }
    }
}
