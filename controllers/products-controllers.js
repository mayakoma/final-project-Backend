const HttpError = require("../model/HttpError");
const Products = require("../model/products");

const addProduct = async (req, res, next) => {
  const { title, description, image, price } = req.body;

  const createdProduct = new Products({
    title,
    description,
    image,
    price,
  });

  try {
    await createdProduct.save();
  } catch (err) {
    const error = new HttpError(
      "Creating Product failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ product: createdProduct.toObject({ getters: true }) });
};

const updateProduct = async (req, res, next) => {
  const { pid, title, description, image, price } = req.body;

  let product;
  try {
    product = await Products.findById(pid);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, cannot update product",
      500
    );
    return next(error);
  }

  if (!product) {
    const error = new HttpError("Product not exists, please try again", 422);
    return next(error);
  }

  product.title = title;
  product.description = description;
  product.price = price;
  product.image = image;

  try {
    await product.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, cannot update user",
      500
    );
    return next(error);
  }
  res.status(201).json({ product: product.toObject({ getters: true }) });
};

const deleteProduct = async (req, res, next) => {
  const { pid } = req.body;
  let product;
  try {
    product = await Products.findById(pid);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, cannot delete product",
      500
    );
    return next(error);
  }
  if (!product) {
    const error = new HttpError(
      "Something went wrong, cannot delete user",
      500
    );
    return next(error);
  }

  try {
    await product.remove();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, cannot delete user",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "Deleted product" });
};

const getProducts = async (req, res, next) => {
  let products;
  try {
    products = await Products.find({});
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find any products.",
      500
    );
    return next(error);
  }
  res.json(products);
};

const searchProductByFilter = async (req, res, next) => {
  const { title } = req.body;
  let product;
  try {
    product = await Products.find({
      title: { $regex: `${title}`, $options: "i" },
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find any products.",
      500
    );
    return next(error);
  }
  if (!product) {
    const error = new HttpError("could not find Products", 500);
    return next(error);
  }
  res.json(product);
};

exports.addProduct = addProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.getProducts = getProducts;
exports.searchProductByFilter = searchProductByFilter;
