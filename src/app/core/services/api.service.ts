import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpEventType, HttpResponse, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { JwtService } from './jwt.service';
import { throwError, Observable, Subject, of } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, map, tap, last } from 'rxjs/operators';
import { Entity } from '../models/entity.model';
import { AlertifyService } from './alertify.service';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor(
        private http: HttpClient,
        private jwtService: JwtService,
        private alertifyService: AlertifyService
    ) { }

    private formatErrors(error: any) {
        console.log('formatErrors', error);
        return of(error);
    }

    get(path: string, params: HttpParams = new HttpParams(), includeError?: boolean): Observable<any> {
        const req = this.http.get(`${environment.baseApiUrl}${path}`, { params });
        if (includeError) {
            console.log('REQUEST WITH ERRORS');
            return req.pipe(catchError(this.formatErrors));
        } else {
            return req;
        }
    }

    put(path: string, body: Object = {}, header?, includeError?: boolean): Observable<any> {
        includeError = includeError ? true : false;
        header = header ? header : { headers: new HttpHeaders().set('Content-Type', 'application/json') };
        const req = this.http.put(
            `${environment.baseApiUrl}${path}`,
            JSON.stringify(body),
            header
        );
        if (includeError) {
            return req.pipe(catchError(this.formatErrors));
        } else {
            return req;
        }
    }

    post(path: string, body, header?, includeError?: boolean): Observable<any> {
        includeError = includeError ? true : false;
        header = header ? header : { headers: new HttpHeaders().set('Content-Type', 'application/json') };
        const req = this.http.post(`${environment.baseApiUrl}${path}`, body, header);
        if (includeError) {
            return req.pipe(catchError(this.formatErrors));
        } else {
            return req;
        }
    }
    putWithProg(path: string, body) {
        const progress = new Subject<number>();
        const data = new Subject<Object>();
        const req = new HttpRequest('PUT', `${environment.baseApiUrl}${path}`, body, {
            reportProgress: true
        });

        this.http.request(req)
            .subscribe(event => {
                switch (event.type) {
                    case HttpEventType.Sent:
                        console.log('Upload started');
                        break;

                    case HttpEventType.UploadProgress:
                        // Compute and show the % done:
                        const percentDone = Math.round(100 * event.loaded / event.total);
                        progress.next(percentDone);
                        break;

                    case HttpEventType.Response:
                        // Close the progress-stream if we get an answer form the API
                        // The upload is complete
                        progress.complete();
                        const resp = event && event.ok && event.body ? event.body : {};
                        data.next(resp);
                        data.complete();
                        break;

                    default:

                }
            }
        );

        return {
            data: data.asObservable(),
            progress: progress.asObservable()
        };
    }

    delete(path: string, includeError?: boolean): Observable<any> {
        includeError = includeError ? true : false;
        const req = this.http.delete(`${environment.baseApiUrl}${path}`);
        if (includeError) {
            return req.pipe(catchError(this.formatErrors));
        } else {
            return req;
        }
    }
}
