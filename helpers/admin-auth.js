const {getDb} = require("../config/connection");
const bcrypt = require("bcrypt");
const collection = require("../config/collection");

module.exports = {
  doLoginAdmin: (adminData) => {
    return new Promise(async (resolve, reject) => {
      let responseAd = {};
      let adminCheck = await getDb()
        .collection(collection.ADMIN_COLLECTION)
        .findOne({ email: adminData.email});

      if (adminCheck) {
        bcrypt.compare(adminData.password,adminCheck.password)
          .then((status) => {
            if (status) {
              console.log("admin password matched");
              responseAd.status = true;
              responseAd.admin = adminCheck;
              resolve(responseAd);
            } else {
              console.log("admin password not matched");
              resolve({ status: false, errMsg: "invalid password"});
            }
          });
      } else {
        resolve({ status: false, errMsg: "invalid email" });
      }
    });
  },

  // for signup collection for admin

  /* 
  createAdminAc: (adminAc) => {
    return new Promise(async (resolve, reject) => {
      adminAc.password = await bcrypt.hash(adminAc.password, 10)
      getDb()
        .collection(collection.ADMIN_COLLECTION)
        .insertOne(adminAc)
        .then((data) => {
          resolve(data);
        });
    });
  },

*/
};
