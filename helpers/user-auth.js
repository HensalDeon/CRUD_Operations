const { ObjectId } = require("mongodb");
const { getDb } = require("../config/connection");
const bcrypt = require("bcrypt");
const collection = require("../config/collection");

module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            const existingUser = await getDb().collection(collection.USER_COLLECTION).findOne({ email: userData.email });

            if (existingUser) {
                const message = {
                    error: true,
                    text: "User already exists. Please login or use a different email.",
                };
                resolve(message);
            } else {
                userData.password = await bcrypt.hash(userData.password, 10);
                getDb()
                    .collection(collection.USER_COLLECTION)
                    .insertOne(userData)
                    .then((data) => {
                        const message = {
                            error: false,
                            text: "Signup successful! Please login to continue.",
                        };
                        resolve(message);
                    });
            }
        });
    },

    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let response = {};
            let userCheck = await getDb().collection(collection.USER_COLLECTION).findOne({ email: userData.email });

            if (userCheck) {
                bcrypt.compare(userData.password, userCheck.password).then((status) => {
                    if (status) {
                        console.log("successfuly logged in!");
                        response.status = true;
                        response.user = userCheck;
                        resolve(response);
                    } else {
                        console.log("password not match");
                        resolve({ status: false, logginErr: "Invalid Password" });
                    }
                });
            } else {
                console.log("login failed");
                resolve({ status: false, logginErr: "Invalid credentials" });
            }
        });
    },

    getUserDetails: () => {
        return new Promise(async (resolve, reject) => {
            let allUsers = await getDb().collection(collection.USER_COLLECTION).find().toArray();
            resolve(allUsers);
        });
    },

    deleteUser: (userId) => {
        return new Promise((resolve, reject) => {
            getDb()
                .collection(collection.USER_COLLECTION)
                .deleteOne({ _id: new ObjectId(userId) })
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },

    editUser: (userId) => {
        return new Promise((resolve, reject) => {
            getDb()
                .collection(collection.USER_COLLECTION)
                .findOne({ _id: new ObjectId(userId) }) // Use 'new' keyword with ObjectId constructor
                .then((response) => {
                    resolve(response);
                });
        });
    },

    updateUser: (data, userId) => {
        return new Promise((resolve, reject) => {
            getDb()
                .collection(collection.USER_COLLECTION)
                .updateOne(
                    { _id: new ObjectId(userId) },
                    {
                        $set: {
                            name: data.Name,
                            email: data.email,
                        },
                    }
                )
                .then((response) => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },

    addUser: (NewUserData) => {
        return new Promise(async (resolve, reject) => {
            NewUserData.password = await bcrypt.hash(NewUserData.password, 10);
            getDb()
                .collection(collection.USER_COLLECTION)
                .insertOne(NewUserData)
                .then((response) => {
                    resolve(response);
                });
        });
    },

    searchUser: (searchQuery) => {
        return new Promise(async (resolve, reject) => {
            try {
                const users = await getDb()
                    .collection(collection.USER_COLLECTION)
                    .find({
                        $or: [
                            { name: { $regex: ".*" + searchQuery + ".*", $options: "i" } },
                            { email: { $regex: ".*" + searchQuery + ".*", $options: "i" } },
                        ],
                    })
                    .toArray();
                resolve(users);
            } catch (error) {
                reject(error);
            }
        });
    },
};
