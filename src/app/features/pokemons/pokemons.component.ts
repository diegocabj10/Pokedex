import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pokemons',
  templateUrl: './pokemons.component.html',
  styleUrls: ['./pokemons.component.scss'],
})
export class PokemonsComponent implements OnInit {
  pages: number = 1;
  pokemons: any[] = [
    {
      name: 'Pokemon 1',
      source: 'assets/svg/pokemon.svg',
    },
    {
      name: 'Pokemon 2',
      source: 'assets/svg/pokemon.svg',
    },
    {
      name: 'Pokemon 3',
      source: 'assets/svg/pokemon.svg',
    },
    {
      name: 'Pokemon 4',
      source: 'assets/svg/pokemon.svg',
    },
    {
      name: 'Pokemon 5',
      source: 'assets/svg/pokemon.svg',
    },
    {
      name: 'Pokemon 6',
      source: 'assets/svg/pokemon.svg',
    },
    {
      name: 'Pokemon 7',
      source: 'assets/svg/pokemon.svg',
    },
    {
      name: 'Pokemon 8',
      source: 'assets/svg/pokemon.svg',
    },
    {
      name: 'Pokemon 9',
      source: 'assets/svg/pokemon.svg',
    },
  ];
  constructor(private translateService: TranslateService,) {}

  ngOnInit(): void {
    this.translateService.use('AR');
  }
}
