const router = require('express-promise-router')();
const authorize = require('../middlewares/authentication/authorize.middleware');
const productController = require('../controllers/products/product.controllers');

router.post('/', productController.createProduct);
router.get('/', authorize, productController.listAllProducts);
router.get('/:id', productController.findProductById);
router.put('/:id', productController.updateProductById);
router.delete('/:id', productController.deleteProductById);

module.exports = router;