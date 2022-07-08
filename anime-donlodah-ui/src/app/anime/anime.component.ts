import { Component, OnInit } from '@angular/core';
import { AnimeService } from '../anime-service/anime.service';

@Component({
  selector: 'app-anime',
  templateUrl: './anime.component.html',
  styleUrls: ['./anime.component.css'],
})
export class AnimeComponent implements OnInit {
  animeUrl: string = '';

  constructor(private animeService: AnimeService) {}

  ngOnInit(): void {
    this.animeUrl = this.animeService.animeUrl;
  }
}
