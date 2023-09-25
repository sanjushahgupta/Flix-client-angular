import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
const baseApiUrl = 'https://flix-api-1faf.onrender.com';

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  constructor(private http: HttpClient) {}
  //User registration
  public registration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(baseApiUrl + '/register', userDetails)
      .pipe(catchError(this.handleError));
  }

  //To userLogin: HTTP Method => post, endpoint -"/login", reqBody - userDetails, token = set token in localstorage
  public login(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post<any>(baseApiUrl + 'login', userDetails).pipe(
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

  //Get all movies:  HTTP Method => get, endpoint -"/movies"
  public movies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(baseApiUrl + '/movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //To movieByTitle: HTTP Method => get, endpoint -"/movies/:title", route Parameter - title, token = get from localstorage, passed token in header
  public movieByTitle(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    const url = `${baseApiUrl}/movies/${title}`;
    return this.http
      .get(url, {
        headers: new HttpHeaders({
          Authorization: 'Bearer' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //To movieBydirectors: HTTP Method => get, endpoint -"/movies/directors/:name", route Parameter - name, token = get from localstorage, passed token in header
  public movieByDirector(name: string): Observable<any> {
    const token = localStorage.getItem('token');
    const url = `${baseApiUrl}/movies/directors/${name}`;
    return this.http
      .get(url, {
        headers: new HttpHeaders({
          Authorization: 'Bearer' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //To movieByGenre: HTTP Method => get, endpoint -"/movies/genre/:name", route Parameter - name, token = get from localstorage, passed token in header
  public movieByGenre(name: string): Observable<any> {
    const token = localStorage.getItem('token');
    const url = `${baseApiUrl}/movies/genre/${name}`;
    return this.http
      .get(url, {
        headers: new HttpHeaders({
          Authorization: 'Bearer' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //To addFavMovie: HTTP Method => post, endpoint -"/addfab/:movieTitle", route Parameter -movieTitle,token = get from localstorage, passed token in header
  public addFavMovie(movieTitle: string): Observable<any> {
    const token = localStorage.getItem('token');
    const url = `${baseApiUrl}/addfab/${movieTitle}`;
    return this.http
      .post(url, {
        headers: new HttpHeaders({
          Authorization: 'Bearer' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //To deletefavMovie: HTTP Method => delete, endpoint -"/deletefab/:movieTitle", route Parameter -movieTitle,token = get from localstorage, passed token in header
  public deleteFavMovie(movieTitle: string): Observable<any> {
    const token = localStorage.getItem('token');
    const url = `${baseApiUrl}/deletefab/${movieTitle}`;
    return this.http
      .delete(url, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //To update user: HTTP Method => put, endpoint -"/updateUser", reqbody-> userToUpdate,token = from localstorage, passed token in header
  public updateUser(userToUpdate: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .put(baseApiUrl + '/updateUser', userToUpdate, {
        headers: new HttpHeaders({
          Authorization: 'Bearer' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

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
