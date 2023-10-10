import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
/** MovieCardComponent is a component used to display list of movies. */
@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})

/**
 * Constructor
 * @param {FetchApiDataService} fetchApiData - FetchApiDataService instance.
 * @param {MatDialogRef} diagolRef - MatDialogRef instance.
 * @param {Router} router - Router instance.
 */
export class MovieCardComponent {
  movies: any[] = [];
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.getMovies();
  }

  /**
   * Fetches movies from the API
   * Sends a request to the API and handles the response.
   * @returns {void}
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((response: any) => {
      this.movies = response;
      return this.movies;
    });
  }

  /** Opens a dialog.
   * @param {any} templateRef - Reference to the template.
   * @returns {void} */
  openDialog(templateRef: any) {
    this.dialog.open(templateRef, {
      width: '500px',
    });
  }

  /** add movie in fav list
   * @param {string} movieId
   * @param {string} movieTitle
   * Calls the API to add movie in fav list
   * @returns {void} */
  addInFav(movieId: string, movieTitle: string): void {
    this.fetchApiData.addFavMovie(movieId, movieTitle).subscribe(() => {});
  }

  /** Removes a movie from favorites.
   * @param {string} movieId
   * @param {string} movieTitle
   * Calls the API to remove movie from fav list
   * @returns {void} */
  removeFav(movieId: string, movieTitle: string): void {
    this.fetchApiData.deleteFavMovie(movieId, movieTitle).subscribe(() => {});
  }

  /** Checks if a movie is in fav list
   * @param {string} movieTitle
   * @returns {boolean} - True if the movie is in favorites else false */
  isFav(movieTitle: string): boolean {
    const isFab = this.fetchApiData.isFavourite(movieTitle);
    return isFab;
  }

  /** Navigates to the profile screen
   * @returns {void} */
  toProfilePage() {
    this.router.navigate(['profile']);
  }

  /**
   * user- logout
   * @returns {void}
   */
  logout() {
    localStorage.clear();
    this.router.navigate(['welcome']);
  }
}
