import { sample } from 'lodash';
import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

// Define a function to format followers
function formatFollowers(followers) {
  if (followers >= 1000) {
    const abbreviatedFollowers = (followers / 1000).toFixed(1);
    return `${abbreviatedFollowers}k`;
  }
  return followers.toString();
}

function generateEmail() {
  if (Math.random() < 0.4) {
    return ''; // 80% of users have no email
  }
  return faker.internet.email(); // 20% of users have a valid email
  
}

export const users = [...Array(20)].map((_, index) => ({
  id: faker.string.uuid(),
  avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
  name: faker.person.fullName(),
  company: faker.company.name(),
  isVerified: faker.datatype.boolean(),
  status: sample(['active', 'banned']),
  role: sample([
    'Leader',
    'Hr Manager',
    'UI Designer',
    'UX Designer',
    'UI/UX Designer',
    'Project Manager',
    'Backend Developer',
    'Full Stack Designer',
    'Front End Developer',
    'Full Stack Developer',
  ]),
  IG_handle: `@user${index + 1}`,
  followers: formatFollowers(faker.datatype.number(50000)), // Adjust the maximum value as needed
  platforms: [true, faker.datatype.boolean(), faker.datatype.boolean()],
  country: faker.address.countryCode(),
  engagement: sample(['B', 'B+', 'A', 'A+']),
  email: generateEmail(), // Use the generateEmail function to determine if an email is provided
}));