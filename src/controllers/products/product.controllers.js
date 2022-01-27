const passport = require('passport')
const db = require('../../config/database/db');

// POST PRODUCT
exports.createProduct = async (req, res, next) => {
    console.log(req.body)
    const { product_name, quantity, price } = req.body;
    const { rows } = await db.query(
        'INSERT INTO products (productname, quantity, price) VALUES ($1, $2, $3)',
        [product_name, quantity, price]
    )

    res.status(201).send({
        message: 'Product added successfullyy',
        body: {
            product: { product_name, quantity, price }
        }
    })
}

// GET ALL PRODUCTS
exports.listAllProducts = async (req, res, next) => {
    console.log(res.locals.user)
    const response = await db.query('SELECT * FROM products ORDER BY productname ASC');
    res.status(200).send(response.rows);
};

// GET PRODUCT BY ID
exports.findProductById = async (req, res) => {
    const productId = parseInt(req.params.id);
    const response = await db.query('SELECT * FROM products WHERE productid = $1', [productId]);
    res.status(200).send(response.rows);
}

// UPDATE PRODUCT BY ID
exports.updateProductById = async (req, res) => {
    const productId = parseInt(req.params.id);
    const { product_name, quantity, price } = req.body;
  
    const response = await db.query(
      "UPDATE products SET productname = $1, quantity = $2, price = $3 WHERE productId = $4",
      [product_name, quantity, price, productId]
    );
  
    res.status(200).send({ message: "Product Updated Successfully!" });
};

// DELETE PRODUCT BY ID
exports.deleteProductById = async (req, res) => {
    const productId = parseInt(req.params.id);
    await db.query('DELETE FROM products WHERE productId = $1', [
      productId
    ]);
  
    res.status(200).send({ message: 'Product deleted successfully!', productId });
};