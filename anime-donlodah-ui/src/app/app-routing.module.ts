import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchAnimeComponent } from './search-anime/search-anime.component';

const routes: Routes = [
  {
    path: '',
    component: SearchAnimeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
