const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

const hashPassword =    async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

class User extends Model {
    // Method to check if a password matches the hashed password stored in the database
    async isValidPassword(password) {
        console.log(password, this.password);
      return bcrypt.compare(password, this.password);
    }
}

User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
  
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [8],
        },
        createdAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW
      },
      updatedAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW
      }
      },
    },
    {    hooks: {
        // Hook to hash the password before creating a new user
        beforeCreate: async (newUserData) => {

          newUserData.password = await hashPassword(newUserData.password);


          return newUserData;
        },
        // Hook to hash the password before updating an existing user's password
        beforeUpdate: async (updatedUserData) => {
          if (updatedUserData.password) {
            //updatedUserData.password = await User.hashPassword(updatedUserData.password);
            updatedUserData.password = await hashPassword(updatedUserData.password);
          }
          return updatedUserData;
        },
      },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'user',
  }
);

module.exports = User;
