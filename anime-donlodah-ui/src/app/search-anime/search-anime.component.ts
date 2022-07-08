import { Component, OnInit } from '@angular/core';
import { ANIMES } from '../animeList';
import { Anime } from '../interfaces';

@Component({
  selector: 'app-search-anime',
  templateUrl: './search-anime.component.html',
  styleUrls: ['./search-anime.component.css'],
})
export class SearchAnimeComponent implements OnInit {
  tasks: Anime[] = ANIMES;

  constructor() {}

  ngOnInit(): void {}
}
