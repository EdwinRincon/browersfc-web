import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class HomeComponent {
  newsItems = [
    {
      image: '../../assets/img/noticia.jpg',
      title: 'Crónica Browers VS Galácticos Team',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure magnam laboriosam ipsum!',
    },
    {
      image: '../../assets/img/noticia2.JPG',
      title: 'Self-Improvement',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure magnam laboriosam ipsum!',
    },
    {
      image: '../../assets/img/noticia.jpg',
      title: 'Travel',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure magnam laboriosam ipsum!',
    },
  ];
}
