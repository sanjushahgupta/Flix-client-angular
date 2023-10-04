import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { publishFacade } from '@angular/compiler';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent {
  movies: any[] = [];
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((response: any) => {
      this.movies = response;
      console.log(this.movies);
      return this.movies;
    });
  }

  openDialog(templateRef: any) {
    this.dialog.open(templateRef, {
      width: '300px',
    });
  }

  addInFav(movieId: string, movieTitle: string): void {
    this.fetchApiData
      .addFavMovie(movieId, movieTitle)
      .subscribe((response: any) => {});
  }
  removeFav(movieId: string, movieTitle: string): void {
    this.fetchApiData
      .deleteFavMovie(movieId, movieTitle)
      .subscribe((response: any) => {});
  }

  isFav(movieTitle: string): boolean {
    const isFab = this.fetchApiData.isFavourite(movieTitle);
    return isFab;
  }
}
