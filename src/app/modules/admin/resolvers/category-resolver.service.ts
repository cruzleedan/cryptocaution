import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Category, CategoryService } from '../../../core';

@Injectable({
    providedIn: 'root'
})
export class CategoryResolver implements Resolve<Category> {

    constructor(
        private categoryService: CategoryService
    ) {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Category> {
        return this.categoryService.findCategoryById(route.params['id']);
    }

}

