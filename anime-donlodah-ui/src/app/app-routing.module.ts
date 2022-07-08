import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchAnimeComponent } from './search-anime/search-anime.component';
import { AnimeComponent } from './anime/anime.component';

const routes: Routes = [
  {
    path: '',
    component: SearchAnimeComponent,
  },
  { path: 'anime', component: AnimeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
