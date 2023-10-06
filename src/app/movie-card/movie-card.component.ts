import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
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

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((response: any) => {
      this.movies = response;
      return this.movies;
    });
  }

  openDialog(templateRef: any) {
    this.dialog.open(templateRef, {
      width: '500px',
    });
  }

  addInFav(movieId: string, movieTitle: string): void {
    this.fetchApiData.addFavMovie(movieId, movieTitle).subscribe(() => {});
  }

  removeFav(movieId: string, movieTitle: string): void {
    this.fetchApiData.deleteFavMovie(movieId, movieTitle).subscribe(() => {});
  }

  isFav(movieTitle: string): boolean {
    const isFab = this.fetchApiData.isFavourite(movieTitle);
    return isFab;
  }

  toProfilePage() {
    this.router.navigate(['profile']);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['welcome']);
  }
}
