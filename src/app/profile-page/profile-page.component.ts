import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

/** ProfilePageComponent is a component which is used to display user's details */
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public router: Router,
    public snackBar: MatSnackBar
  ) {}

  /** Input new data to update user
   * userName,password,birth,email should be provided.
   * favourite movies will be fetched from local storage
   * @type {object}
   */
  @Input() userData = {
    userName: this.userDetails().userName,
    password: 'Your password',
    email: this.userDetails().email,
    birth: this.userDetails().birth,
    favoriteMovies: this.userDetails().favoriteMovies,
  };

  ngOnInit(): void {}

  /** Updates details of user
   * Calls the API to update the user's profile.
   * @params{object} userData
   * @returns {any} The response from the API.
   */
  updateProfile(): any {
    if (this.userData.password == 'Your password') {
      this.snackBar.open(
        'Password is compulsory. If you do not want to change password , use current password',
        'OK',
        {
          duration: 3000,
        }
      );
    } else {
      this.fetchApiData.updateUser(this.userData).subscribe((response) => {
        localStorage.setItem('user', JSON.stringify(this.userData));
        this.snackBar.open('Account updated', 'OK', {
          duration: 2000,
        });
        return response;
      });
    }
  }

  /** Deletes the user profile
   * Calls the API to delete the user's profile.
   * @returns {any}
   */
  deleteProfile(): void {
    this.fetchApiData.deleteUser().subscribe((response) => {
      if (response === 'Account deleted') {
        localStorage.clear();
        this.router.navigate(['welcome']);
      } else {
        this.snackBar.open('Something went wrong. Please try again', 'OK', {
          duration: 2000,
        });
      }
    });
  }

  /** Opens a dialog.
   * @param {any} templateRef - Reference to the template
   */
  openDialog(templateRef: any) {
    this.dialog.open(templateRef, {
      width: '300px',
    });
  }

  /** get user details from local storage
   * @returns {any}
   */
  userDetails(): any {
    var loggedInUser = localStorage?.getItem('user');
    if (loggedInUser) {
      return JSON.parse(localStorage.getItem('user') || '{Token not found}');
    }
    return 'User not found.';
  }
}
