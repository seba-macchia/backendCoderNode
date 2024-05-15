const userDao = require('../dao/mongo/userDao');

const userFactory = (dao) => {
  switch (dao) {
    case 'default':
      return userDao;
    default:
      throw new Error('DAO not found');
  }
};

module.exports = userFactory;