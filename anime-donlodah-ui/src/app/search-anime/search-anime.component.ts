import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimeService } from '../anime-service/anime.service';
import { Anime } from '../interfaces';

@Component({
  selector: 'app-search-anime',
  templateUrl: './search-anime.component.html',
  styleUrls: ['./search-anime.component.css'],
})
export class SearchAnimeComponent implements OnInit {
  animes: Anime[] = [];
  anime: string = '';

  constructor(private animeService: AnimeService, private router: Router) {}

  ngOnInit(): void {
    this.animeService
      .getAllAnimes()
      .subscribe((animes) => (this.animes = animes));
  }

  animeSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    const searchString = target.value;
    this.animeService
      .getAnimesSearch(searchString)
      .subscribe((animes) => (this.animes = animes));
  }

  goToAnime(url: string): void {
    this.animeService.animeUrl = url;
    this.router.navigate(['anime']);
  }
}
