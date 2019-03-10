module.exports = function (sequelize, DataTypes) {
   
    var favorite_restaurants = sequelize.define("favorite_restaurants", {
        username: DataTypes.STRING,
        yelp_id: DataTypes.STRING,
    });

    return favorite_restaurants;
};