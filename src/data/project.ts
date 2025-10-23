import type { StaticImageData } from 'next/image'; // Import kiểu này
import urbanEleganceImage from '../assets/section_04/bts_01.png'; 
import desertFashionImage from '../assets/section_04/bts_02.png'; 
import portraitsOfResilienceImage from '../assets/section_04/bts_03.png'; 

export interface Project {
  slug: string;
  title: string;
  imageUrl: StaticImageData | string;
  description: string;
  client?: string; // client có thể không bắt buộc
  year?: string;
  location?: string;
}
const projects: Project[] = [
  {
    slug: 'urban-elegance',
    title: 'Urban Elegance',
    imageUrl: urbanEleganceImage,
    description: 'A series exploring the interplay of light and shadow on contemporary city architecture. This project captures the stark beauty of urban landscapes through a minimalist lens, focusing on geometric patterns and reflective surfaces.',
    client: 'CityScape Magazine',
    year: '2023',
    location: 'New York City',
  },
  {
    slug: 'desert-fashion',
    title: 'Desert Fashion',
    imageUrl: desertFashionImage,
    description: 'An editorial photoshoot set against the dramatic backdrop of the desert. This collection blends high fashion with natural ruggedness, showcasing garments designed for both elegance and adventure.',
    client: 'Vogue Arabia',
    year: '2022',
    location: 'Dubai Desert',
  },
  {
    slug: 'portraits-of-resilience',
    title: 'Portraits of Resilience',
    imageUrl: portraitsOfResilienceImage,
    description: 'A deeply personal project documenting the strength and spirit of individuals who have overcome significant challenges. Each portrait tells a story of perseverance, captured with raw honesty and profound empathy.',
    client: 'Personal Project',
    year: '2021',
    location: 'Global',
  },
];

export default projects;