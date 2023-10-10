import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';

/** FetchApiDataService class is used for fetching data from the API */
@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  /** constructor
   *  @param {HttpClient} http ->  HttpClient instance
   */
  constructor(private http: HttpClient) {}

  private baseApiUrl = 'https://flix-api-1faf.onrender.com';

  /**
   * To register user
   * @param {object} userDetails - User details for registration.
   * @returns {Observable<any>} Observable of the registration API response.
   */
  public registration(userDetails: any): Observable<any> {
    return this.http
      .post(this.baseApiUrl + '/register', userDetails)
      .pipe(catchError(this.handleError));
  }

  /**
   * To login user
   * @param {object} userDetails
   * @returns {Observable<any>} Observable of the login API response.
   */
  //To userLogin: HTTP Method => post, endpoint -"/login", reqBody - userDetails, token = set token in localstorage
  public login(userDetails: any): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/login`, userDetails).pipe(
      tap((response) => {
        const token = response?.token;
        const loggedInUser = response?.user;
        if (token) {
          localStorage.setItem('token', token); //set token
          localStorage.setItem('user', JSON.stringify(loggedInUser)); //set user - only username no password
        } else {
          console.error('Token or user not found in the response');
        }
      }),
      catchError(this.handleError)
    );
  }

  //Get all movies:  HTTP Method => get, endpoint -"/movies"
  /**
   * To get all movies
   * @returns {Observable<any>} Observable of the getallMovies API response.
   */
  public getAllMovies(): Observable<any> {
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
  /**
   * To get movie by title
   * @param {string} title
   * @returns {Observable<any>}
   */
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
  /**
   * To get movie details by director
   * @param {string} name -> director's name
   * @returns {Observable<any>}
   */
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
  /**
   * To get movie details by movie's genre
   * @param {string} name -> genre
   * @returns {Observable<any>}
   */
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
  // I have passed movieId just to save in local storage as movie is searched by title and then add it db with movie id so need to save in local storage by id
  /**
   * To get add movie to fav list
   * @param {string} movieId
   * @param {string} movieTitle
   * @returns {Observable<any>}
   */
  public addFavMovie(movieId: string, movieTitle: string): Observable<any> {
    const token = this.getToken();
    const url = `${this.baseApiUrl}/addfab/${movieTitle}`;
    const requestData = { movieId: movieId, movieTitle: movieTitle };
    return this.http
      .post<any>(url, requestData, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(
        map(this.getResponseData),
        tap((response) => {
          if (response) {
            const loggedInUser = JSON.parse(
              localStorage.getItem('user') || '{}'
            );
            loggedInUser.favoriteMovies = loggedInUser.favoriteMovies || [];
            loggedInUser.favoriteMovies.push(movieId);
            localStorage.setItem('user', JSON.stringify(loggedInUser));
          }
        }),
        catchError(this.handleError)
      );
  }

  //Get FavMovieList of loggedIn user
  /**
   * To get list of fav movies
   * @returns {any}
   */
  public getFavouriteMovies(): any {
    const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
    return loggedInUser.favoriteMovies || [];
  }

  //To deletefavMovie: HTTP Method => delete, endpoint -"/deletefab/:movieTitle", route Parameter -movieTitle,token = get from localstorage, passed token in header
  // passed movieId  to save in local storage as movie is searched by title and then remove it db with movie id so need to delete in local storage by id
  /**
   * To delete movie from fav list
   * @param {string} movieId
   * @param {string} movieTitle
   * @returns {Observable<any>}
   */
  public deleteFavMovie(movieId: string, movieTitle: string): Observable<any> {
    const token = this.getToken();
    const url = `${this.baseApiUrl}/deletefab/${movieTitle}`;

    return this.http
      .delete(url, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(
        map(this.getResponseData),
        tap((response) => {
          if (response) {
            const loggedInUser = JSON.parse(
              localStorage.getItem('user') || '{}'
            );
            loggedInUser.favoriteMovies = loggedInUser.favoriteMovies || [];
            loggedInUser.favoriteMovies.pop(movieId);
            localStorage.setItem('user', JSON.stringify(loggedInUser));
            console.log('user is', localStorage.getItem('user'));
          }
        }),
        catchError(this.handleError)
      );
  }

  //To update user: HTTP Method => put, endpoint ->"/updateUser", reqbody-> userToUpdate,token = from localstorage, passed token in header
  /**
   * To update user's details
   * @param {object} userToUpdate
   * @returns {Observable<any>}
   */
  public updateUser(userToUpdate: any): Observable<any> {
    const token = this.getToken();

    return this.http
      .put(this.baseApiUrl + '/updateUser', userToUpdate, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.getResponseData), catchError(this.handleError));
  }

  public isFavourite(movieId: string): boolean {
    const user = this.getLoggedInUser();
    if (user) {
      const isfab = user.favoriteMovies.includes(movieId);
      return isfab;
    }
    return false;
  }

  //To delete user: HTTP Method => delete,  endpoint ->("/deleteUser", token = from localstorage, passed token in header)
  /**
   * To delete user
   * @returns {Observable<any>}
   */
  public deleteUser(): Observable<any> {
    const token = this.getToken();

    return this.http
      .delete(this.baseApiUrl + '/deleteUser', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
        responseType: 'text',
      })
      .pipe(map(this.getResponseData), catchError(this.handleError));
  }

  public getLoggedInUser(): any {
    var loggedInUser = localStorage?.getItem('user');
    if (loggedInUser) {
      return JSON.parse(localStorage.getItem('user') || '{Token not found}');
    }

    return 'user not found';
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
