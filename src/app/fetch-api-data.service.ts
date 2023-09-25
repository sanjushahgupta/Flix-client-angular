import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
const apiUrl = 'https://flix-api-1faf.onrender.com';

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  constructor(private http: HttpClient) {}
  //User registration
  public registration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + '/register', userDetails)
      .pipe(catchError(this.handleError));
  }

  //User login
  public login(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post<any>(apiUrl + 'login', userDetails).pipe(
      tap((response) => {
        const token = response?.token;
        if (token) {
          localStorage.setItem('token', token); //set token
        } else {
          console.error('Token not found in the response');
        }
      }),
      catchError(this.handleError)
    );
  }

  //Get all movies
  public movies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + '/movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }
//get movie by title
  public movieByTitle(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + '/movies/:title', {
        headers: new HttpHeaders({
          Authorization: 'Bearer' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }
  
  //movies/directors/:name"
  //start from here
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

  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }
}
