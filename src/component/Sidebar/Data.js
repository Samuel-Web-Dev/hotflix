import {  MyLogo, action, adventure, popular, topRated, upComing, animation, comedy, crime, documentary, drama, family, fantasy, history, horror, music, mystery, romance, scienceFiction, movie, thriller, war, western } from '../../assets/Images'

const categories = [
  {
    icon: `${popular}`,
    title: 'Popular',
    group: 'popular',
    id: 1
  },
  {
    icon: `${topRated}`,
    title: 'Top Rated',
    group: 'top_rated',
    id: 2
  },
  {
    icon: `${upComing}`,
    title: 'Upcoming',
    group: 'upcoming',
    id: 3
  }
];



const genres = [ 
    {
      icon: `${action}`,
      title: 'Action',
      withGenre: 28,
      id: 4
    },
    {
      icon: `${adventure}`,
      title: 'Adventure',
      withGenre: 12,
      id: 5
    },
    {
      icon: `${animation}`,
      title: 'Animation',
      withGenre: 16,
      id: 6
    },
    {
      icon: `${comedy}`,
      title: 'Comedy',
      withGenre: 35,
      id: 7
    },
    {
      icon: `${crime}`,
      title: 'Crime',
      withGenre: 80,
      id: 8
    },
    {
      icon: `${documentary}`,
      title: 'Documentary',
      withGenre: 99,
      id: 9
    },
    {
      icon: `${drama}`,
      title: 'Drama',
      withGenre: 18,
      id: 10
    },
    {
      icon: `${family}`,
      title: 'Family',
      withGenre: 10751,
      id: 11
    },
    {
      icon: `${fantasy}`,
      title: 'Fantasy',
      withGenre: 14,
      id: 12
    },
    {
      icon: `${history}`,
      title: 'History',
      withGenre: 36,
      id: 13
    },
    {
      icon: `${horror}`,
      title: 'Horror',
      withGenre: 27,
      id: 14
    },
    {
      icon: `${music}`,
      title: 'Music',
      withGenre: 10402,
      id: 15
    },
    {
      icon: `${mystery}`,
      title: 'Mystery',
      withGenre: 9648,
      id: 16
    },
    {
      icon: `${romance}`,
      title: 'Romance',
      withGenre: 10749,
      id: 17
    },
    {
      icon: `${scienceFiction}`,
      title: 'Science Fiction',
      withGenre: 878,
      id: 18
    },
    {
      icon: `${movie}`,
      title: 'TV Movie',
      withGenre: 10770,
      id: 19
    },
    {
      icon: `${thriller}`,
      title: 'Thriller',
      withGenre: 53,
      id: 20
    },
    {
      icon: `${war}`,
      title: 'War',
      withGenre: 10752,
      id: 21
    },
    {
      icon: `${western}`,
      title: 'Western',
      withGenre: 37,
      id: 22
    }
]


export { categories, genres }