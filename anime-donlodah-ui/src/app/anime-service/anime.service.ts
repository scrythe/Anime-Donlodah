import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { Anime } from '../interfaces';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AnimeService {
  private apiUrl = 'assets/anime-list.json';

  constructor(private http: HttpClient) {}

  getAllAnimes(): Observable<Anime[]> {
    return this.http.get<Anime[]>(this.apiUrl);
  }

  getAnimesSearch(search: string): Observable<Anime[]> {
    const searchString = search.toLowerCase();
    const animeSearch = new Promise<Anime[]>((resolve) => {
      this.getAllAnimes().subscribe((allAnimes) => {
        const animes = allAnimes.filter((anime) => {
          const animeName = anime.name.toLowerCase();
          return animeName.startsWith(searchString);
        });
        resolve(animes);
      });
    });
    return from(animeSearch);
  }
}
