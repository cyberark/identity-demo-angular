import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    if (localStorage.getItem("username") !== null) {
      this.router.navigate(['user']);
    }
  }

  onFlow1Start() {
    this.router.navigate(['flow1'])
  }

}
