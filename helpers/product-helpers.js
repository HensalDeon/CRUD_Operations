const collection = require("../config/collection");
const { PRODUCT_COLLECTION } = require("../config/collection");
const { getDb } = require("../config/connection");
const objectId = require("mongodb").ObjectId;

module.exports = {
    addProduct: (product, callback) => {
        getDb()
            .collection("products")
            .insertOne(product)
            .then((data) => {
                callback(data.insertedId);
            });
    },
    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            let products = await getDb().collection(PRODUCT_COLLECTION).find().toArray();
            resolve(products);
        });
    },

    deleteProduct: (productId) => {
        return new Promise((resolve, reject) => {
            getDb()
                .collection(PRODUCT_COLLECTION)
                .deleteOne({ _id: new objectId(productId) })
                .then((response) => {
                    resolve(response);
                });
        });
    },

    getProductDetails: (prodID) => {
        return new Promise((resolve, reject) => {
            getDb()
                .collection(collection.PRODUCT_COLLECTION)
                .findOne({ _id: new objectId(prodID) })
                .then((response) => {
                    resolve(response);
                });
        });
    },

    updateProduct: (prodDetails) => {
        return new Promise((resolve, reject) => {
            getDb()
                .collection(collection.PRODUCT_COLLECTION)
                .updateOne(
                    { _id: new objectId(prodDetails.id) },
                    {
                        $set: {
                            Name: prodDetails.Name,
                            description: prodDetails.description,
                            price: prodDetails.price,
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
};
