import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  constructor(private http: HttpClient) {}
  private baseApiUrl = 'https://flix-api-1faf.onrender.com';

  public registration(userDetails: any): Observable<any> {
    console.log('user is', userDetails);

    return this.http
      .post(this.baseApiUrl + '/register', userDetails)
      .pipe(catchError(this.handleError));
  }

  //To userLogin: HTTP Method => post, endpoint -"/login", reqBody - userDetails, token = set token in localstorage
  public login(userDetails: any): Observable<any> {
    console.log(userDetails);

    return this.http.post<any>(`${this.baseApiUrl}/login`, userDetails).pipe(
      tap((response) => {
        const token = response?.token;
        const loggedInUser = response?.user;
        if (token) {
          localStorage.setItem('token', token); //set token
          localStorage.setItem('user', JSON.stringify(loggedInUser)); //set user - only username no password
          console.log('user logged In');
        } else {
          console.error('Token or user not found in the response');
        }
      }),
      catchError(this.handleError)
    );
  }

  //Get all movies:  HTTP Method => get, endpoint -"/movies"
  public movies(): Observable<any> {
    const token = this.getToken();

    return this.http
      .get(this.baseApiUrl + '/movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.getResponseData), catchError(this.handleError));
  }

  //Get movieByTitle: HTTP Method => get, endpoint -"/movies/:title", route Parameter - title, token = get from localstorage, passed token in header
  public movieByTitle(title: string): Observable<any> {
    const token = this.getToken();
    const url = `${this.baseApiUrl}/movies/${title}`;

    return this.http
      .get(url, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.getResponseData), catchError(this.handleError));
  }

  //Get movieBydirectors: HTTP Method => get, endpoint -"/movies/directors/:name", route Parameter - name, token = get from localstorage, passed token in header
  public movieByDirector(name: string): Observable<any> {
    const token = this.getToken();
    const url = `${this.baseApiUrl}/movies/directors/${name}`;

    return this.http
      .get(url, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.getResponseData), catchError(this.handleError));
  }

  //Get movieByGenre: HTTP Method => get, endpoint -"/movies/genre/:name", route Parameter - name, token = get from localstorage, passed token in header
  public movieByGenre(name: string): Observable<any> {
    const token = this.getToken();
    const url = `${this.baseApiUrl}/movies/genre/${name}`;

    return this.http
      .get(url, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.getResponseData), catchError(this.handleError));
  }

  //To addFavMovie: HTTP Method => post, endpoint -"/addfab/:movieTitle", route Parameter -movieTitle,token = get from localstorage, passed token in header
  public addFavMovie(movieTitle: string): Observable<any> {
    const token = this.getToken();
    const url = `${this.baseApiUrl}/addfab/${movieTitle}`;

    return this.http
      .post(url, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(
        map(this.getResponseData),
        tap((response) => {
          if (response && response.status === 201) {
            const loggedInUser = JSON.parse(
              localStorage.getItem('loggedInUser') || '{}'
            );
            loggedInUser.favoriteMovies = loggedInUser.favoriteMovies || [];
            loggedInUser.favoriteMovies.push(movieTitle);
            localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
          }
        }),
        catchError(this.handleError)
      );
  }

  //Get FavMovieList of loggedIn user
  public getFavouriteMovies(): any {
    const loggedInUser = JSON.parse(
      localStorage.getItem('loggedInUser') || '{}'
    );
    return loggedInUser.favoriteMovies || [];
  }

  //To deletefavMovie: HTTP Method => delete, endpoint -"/deletefab/:movieTitle", route Parameter -movieTitle,token = get from localstorage, passed token in header
  public deleteFavMovie(movieTitle: string): Observable<any> {
    const token = this.getToken();
    const url = `${this.baseApiUrl}/deletefab/${movieTitle}`;

    return this.http
      .delete(url, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.getResponseData), catchError(this.handleError));
  }

  //To update user: HTTP Method => put, endpoint ->"/updateUser", reqbody-> userToUpdate,token = from localstorage, passed token in header
  public updateUser(userToUpdate: any): Observable<any> {
    const token = this.getToken();

    return this.http
      .put(this.baseApiUrl + '/updateUser', userToUpdate, {
        headers: new HttpHeaders({
          Authorization: 'Bearer' + token,
        }),
      })
      .pipe(map(this.getResponseData), catchError(this.handleError));
  }

  //To delete user: HTTP Method => delete,  endpoint ->("/deleteUser", token = from localstorage, passed token in header)
  public deleteUser(): Observable<any> {
    const token = this.getToken();

    return this.http
      .delete(this.baseApiUrl + '/deleteUser', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.getResponseData), catchError(this.handleError));
  }

  public getLoggedInUser(): any {
    const user = JSON.parse(
      localStorage.getItem('loggedInUser') || '{User not found}'
    );
    return user;
  }

  private handleError(error: any): any {
    console.error('An error occurred:', error);
    return throwError(() => 'Something went wrong.');
  }

  private getResponseData(res: any): any {
    const body = res;
    return body;
  }

  private getToken(): string {
    const token = localStorage.getItem('token') || '{Token not found}';
    return token;
  }
}
