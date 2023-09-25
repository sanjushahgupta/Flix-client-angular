import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';
const api_url = 'https://flix-api-1faf.onrender.com';

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  constructor(private http: HttpClient) {}
  //User registration
  public registration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(api_url + '/register', userDetails)
      .pipe(catchError(this.handleError));
  }

  //User login
  public login(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(api_url + '/login', userDetails)
      .pipe(catchError(this.handleError));
  }

  //Get all movies

  private handleError(error: any): any {
    if (error) {
      console.error('Some error occurred:', error);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }
}
