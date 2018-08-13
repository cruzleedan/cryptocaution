import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CategoryService, Category } from '../../core';
import { map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CategoryResolver implements Resolve<Category> {

    constructor(
        private categoryService: CategoryService,
        private router: Router
    ) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<Category> {
        return this.categoryService.findCategoryById(route.params['id'])
            .pipe(
                map((res: Response) => {
                    if (!res.status) {
                        throw new Error('Something went wrong');
                    }
                    console.log('FIND CATEGORY BY ID ' + route.params['id']);
                    return res['data'][0];
                }),
                catchError(err => of([]))
            );
    }
}
