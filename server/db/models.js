const { DataTypes } = require('sequelize');
// const { PodcastsSharp } = require('@mui/icons-material');
const { sequelize } = require('./index');
//import PostList from '../../client/pages/PostList.jsx';

const numericRangeValidator = (min, max) => ({
  isNumeric: {
    msg: 'Field must be a number'
  },
  min: {
    args: [min],
    msg: `Field must be greater than or equal to ${min}`
  },
  max: {
    args: [max],
    msg: `Field must be less than or equal to ${max}`
  }
});

  const UserEvents =  sequelize.define('UserEvents', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING,
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Events',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'UserEvents',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "userId",
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
      {
        name: "eventId",
        using: "BTREE",
        fields: [
          { name: "eventId" },
        ]
      },
    ]
  });


const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  googleId: {
    type: DataTypes.STRING,
  },
  image: {
    type: DataTypes.STRING,
  },
  username: {
    type: DataTypes.STRING,

    // allowNull: false

  },
  email: {
    type: DataTypes.STRING,
    allowNull: true //set to allow true temporarily
  },
  password: {
    type: DataTypes.STRING,

    // allowNull: false

  },
  age: {
    type: DataTypes.INTEGER
  },
  maxTravelDist: {
    type: DataTypes.INTEGER
  },
  sober: {
    type: DataTypes.BOOLEAN
  },
  canHost: {
    type: DataTypes.BOOLEAN
  },
  DM: {
    type: DataTypes.STRING
  },
  combatHeaviness: {
    type: DataTypes.INTEGER,
    validate: numericRangeValidator(1, 5)
  },
  strategyHeaviness: {
    type: DataTypes.INTEGER,
    validate: numericRangeValidator(1, 5)
  },
  roleplayFocus: {
    type: DataTypes.INTEGER,
    validate: numericRangeValidator(1, 5)
  },
  storyFocus: {
    type: DataTypes.INTEGER,
    validate: numericRangeValidator(1, 5)
  },
  friends: {
    // this was originally an array of friends' usernames
    // but mySQL (without postGRES) doesn't support storing data in an array that way
    // so for now we could store usernames as a string and separate each one w/ a certain character
    // ex. a semicolon, like so:
    // 'friend1;friend2;friend3'
    type: DataTypes.STRING
  }
});

 const Chats = sequelize.define('Chats', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    groupId: {
      type: DataTypes.INTEGER
    },
    eventId: {
      type: DataTypes.INTEGER
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  });



const Message = sequelize.define('Message', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },

  chatId: {
    type: DataTypes.INTEGER,
    references: {
      model: Chats,
      key: 'id'
    }
  },

  text: {
    type: DataTypes.STRING
  },

  votes: {
    type: DataTypes.INTEGER
  }

});


const Events = sequelize.define('Events', {
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  start: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end: {
    type: DataTypes.DATE,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  isOnline: {
    type: DataTypes.BOOLEAN
  },
  isInPerson: {
    type: DataTypes.BOOLEAN
  },
  street: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  city: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  state: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  zip: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  long: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  lat: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  link: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  hostId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  selectedUsers: {
    type: DataTypes.STRING(1000),
    allowNull: true
  }
  // chatId: {
  //   type: DataTypes.INTEGER,
  //   allowNull: true
  // }
});

const Posts = sequelize.define('post', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  post: {
    type: DataTypes.STRING(255)
  },
  upVotes: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
});

const Sheets = sequelize.define('Sheets', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  charName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  charRace: {
    type: DataTypes.STRING,
    allowNull: true
  },
  charClass: {
    type: DataTypes.STRING,
    allowNull: true
  },
  str: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  dex: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  con: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  int: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  wis: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cha: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  charDesc: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

const UserEventsPhotos = sequelize.define('UserEventsPhotos', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  eventId: {
    type: DataTypes.INTEGER,
    references: {
      model: Events,
      key: 'id'
    }
  },
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  photoUrl: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

User.hasMany(Message, { foreignKey: 'userId' });
Message.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Sheets, { foreignKey: 'userId' });
Sheets.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Posts, { foreignKey: 'userId' });
Posts.belongsTo(User, { foreignKey: 'userId' });
UserEventsPhotos.belongsTo(User, { foreignKey: 'userId' });
UserEventsPhotos.belongsTo(Events, { foreignKey: 'eventId' });
Events.hasMany(UserEventsPhotos, { foreignKey: 'eventId' });
User.hasMany(UserEventsPhotos, { foreignKey: 'userId' });
module.exports = {
  User,
  Message,
  Events,
  UserEvents,
  Sheets,
  Posts,
  UserEventsPhotos
};
