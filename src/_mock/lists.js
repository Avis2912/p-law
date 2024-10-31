import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

const POST_TITLES = [
  'N/A',
  '✨ My Favourites',
  'TikTok 1-10k influencers',
  'February valentines launch (new red base)',
  'YouTube LipGloss leads',
  'All-platform Microinfluencers',
  'Instagram 50k+',
  'FENTY collaboration launch',
  'Sponsor leads',
  'YouTube long term partnership leads',
  'List of inbound microinfluencers',





  
];

export const posts = [...Array(POST_TITLES.length - 1)].map((_, index) => ({
  id: faker.string.uuid(),
  cover: `/assets/images/covers/cover_${index + 1}.jpg`,
  title: POST_TITLES[index + 1],
  createdAt: faker.date.past(),
  view: faker.number.int(99999),
  comment: faker.number.int(99999),
  share: faker.number.int(99999),
  favorite: faker.number.int(99999),
  author: {
    name: faker.person.fullName(),
    avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
  },
}));
