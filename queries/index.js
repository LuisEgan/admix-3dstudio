import users from './users';
import campaigns from './campaigns';
import creatives from './creatives';
import groups from './groups';

export default {
  ...users,
  ...campaigns,
  ...creatives,
  ...groups,
};
