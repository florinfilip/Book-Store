const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString();
  });

  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }
  const updatedCart = {
    items: updatedCartItems,
  };

  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  console.log(this.cart.items);
  const updatedCartProducts = this.cart.items.filter((cp) => {
    return cp.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartProducts;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);

// const mongoDB = require("mongodb");
// const getDb = require("../util/database").getDb;

// class User {
//   constructor(username, email, cart, id) {
//     this.username = username;
//     this.email = email;
//     this.cart = cart;
//     this._id = new mongoDB.ObjectId(id);
//   }

//   save() {
//     const db = getDb();
//     db.collection("users")
//       .insertOne(this)
//       .then((result) => console.log(result))
//       .catch((err) => console.log(err));
//   }

//   addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex((cp) => {
//       return cp.productId.toString() === product._id.toString();
//     });

//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];

//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         productId: new mongoDB.ObjectId(product._id),
//         quantity: newQuantity,
//       });
//     }
//     const updatedCart = {
//       items: updatedCartItems,
//     };

//     const db = getDb();
//     db.collection("users").updateOne(
//       {
//         _id: new mongoDB.ObjectId(this._id),
//       },
//       { $set: { cart: updatedCart } }
//     );
//   }

//   deleteFromCart(productId) {
//     console.log(this.cart.items);
//     const updatedCartProducts = this.cart.items.filter((cp) => {
//       return cp.productId.toString() !== productId.toString();
//     });
//     console.log(updatedCartProducts);

//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongoDB.ObjectId(this._id) },
//         { $set: { cart: { items: updatedCartProducts } } }
//       );
//   }

//   getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map((i) => {
//       return i.productId;
//     });
//     return db
//       .collection("products")
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) => {
//         return products.map((p) => {
//           return {
//             ...p,
//             quantity: this.cart.items.find((i) => {
//               return i.productId.toString() === p._id.toString();
//             }).quantity,
//           };
//         });
//       });
//   }

//   static findById(userId) {
//     const db = getDb();
//     return db
//       .collection("users")
//       .findOne({ _id: new mongoDB.ObjectId(userId) })
//       .then((user) => {
//         return user;
//       })
//       .catch((err) => console.log(err));
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: new mongoDB.ObjectId(this._id),
//             name: this.name,
//           },
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then((result) => {
//         this.cart = { items: [] };
//         return db
//           .collection("users")
//           .updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       });
//   }
//   getOrders() {
//     const db = getDb();
//     return db
//       .collection("orders")
//       .find({ "user._id": new mongoDB.ObjectId(this._id) })
//       .toArray();
//   }
// }

// module.exports = User;
