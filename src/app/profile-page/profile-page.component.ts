import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  @Input() userData = {
    userName: this.userDetails().userName,
    password: 'Your password',
    email: this.userDetails().email,
    birth: this.userDetails().birth,
    favouriteMovies: this.userDetails().favouriteMovies,
  };

  ngOnInit(): void {}

  updateProfile(): any {
    if (this.userData.password == 'Your password') {
      this.snackBar.open(
        'Password is compulsory. If you do not want to change password , use current password',
        'OK',
        {
          duration: 2000,
        }
      );
    } else {
      this.fetchApiData.updateUser(this.userData).subscribe((response) => {
        console.log('from update', response);
        localStorage.setItem('user', JSON.stringify(this.userData));
        return response;
      });
    }
  }

  deleteProfile(): void {
    this.fetchApiData.deleteUser().subscribe((response) => {
      console.log('delete', response);
      if (response === 'Account deleted') {
        localStorage.clear();
        this.router.navigate(['welcome']);
      } else {
        console.log('Profile not deleted');
      }
    });
  }

  openDialog(templateRef: any) {
    this.dialog.open(templateRef, {
      width: '300px',
    });
  }

  userDetails(): any {
    var loggedInUser = localStorage?.getItem('user');
    if (loggedInUser) {
      console.log('from profile', loggedInUser);
      return JSON.parse(localStorage.getItem('user') || '{Token not found}');
    }
    return 'User not found.';
  }
}
