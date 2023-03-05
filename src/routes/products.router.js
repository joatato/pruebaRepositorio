const { Router } = require('express')
const router = Router()
const productManager = require('../manager/productManager')
const pm = new productManager("./src/files/products.json")


router.get('/', async (req, res) => {
    let limit = req.query.limit
    let products = await pm.getProduct()
    if (limit < products.length) {
        let productsLimit = products
        productsLimit.splice(limit, products.length - limit)
        res.setHeader('Content-type', 'application/json')
        res.status(200).json({
            message: `Los ${limit} productos:`,
            productsLimit
        })
    } else if (products) {
        res.setHeader('Content-type', 'application/json')
        res.status(200).json({
            message: "Los productos actuales son: ",
            products
        })
    } else {
        res.setHeader('Content-Type', 'application/json')
        res.status(404).json({
            message: "404 Not Found. No hay productos aún"
        })
    }
})



router.get('/:pid', async (req, res) => {
    let id = req.params.pid
    let product = await pm.getProductById(id)
    if (product) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({
            message: `Aqui tiene su producto con id ${id}`,
            product
        })
    }
    res.setHeader('Content-Type', 'application/json')
    res.status(404).json({
        message: `404 Not Found. No se ha encontrado un producto con el id: ${id}`
    })
})



router.post('/', async (req, res) => {
    console.log(req.body)

    let product = req.body
    if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category || Object.keys(product).some(key => key !== 'title' && key !== 'description' && key !== 'code' && key !== 'price' && key !== 'stock' && key !== 'category'&& key !== 'thumbnail')) {
        res.setHeader('Content-Type', 'application/json')
        let falta = []
        if (!product.title) {
            falta.push("title")
        }
        if (!product.description) {
            falta.push("description")
        }
        if (!product.code) {
            falta.push("code")
        }
        if (!product.price) {
            falta.push("price")
        }
        if (!product.stock) {
            falta.push("stock")
        }
        if (!product.category) {
            falta.push("category")
        }
        falta.join(", ")
        if (falta.length) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({
                message: `400 Bad Request. Debe ingresar: ${falta}. Para poder cargar el producto`,
                product
            })
        }
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({
            message: `400 Bad Request. Hay parámetros que está ingresando de sobra.`,
            product
        })
    }
    let productAdded = await pm.addProduct(product)
    if (productAdded) {
        console.log(productAdded)
        res.setHeader('Content-Type', 'application/json')
        return res.status(201).json({
            message: `Todo ok...!`,
            product,
        })
    } else {
        res.setHeader('Content-Type', 'application/json')
        res.status(400).json({
            message: `400 Bad Request. El product con código: ${product.code} . Ya existe en la base de datos`
        })
    }
})



router.put('/:pid', async (req, res) => {
    let id = req.params.pid
    let key = req.body.key
    let value = req.body.value

    if (!id || !key || !value) {

        let falta = []
        if (!id) {
            falta.push("id")
        }
        if (!key) {
            falta.push("key")
        }
        if (!value) {
            falta.push("value")
        }
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({
            message: `400 Bad Request. Debe ingresar: ${falta}. Para poder actualizar el producto.`
        })
    }

    let indice = await pm.getProductById(id)

    if (indice) {
        await pm.updateProduct(id, key, value)
        let product = await pm.getProductById(id)
        res.setHeader('Content-Type', 'application/json')
        return res.status(201).json({
            message: `Todo ok...!`,
            product
        })
    }
    res.setHeader('Content-Type', 'application/json')
    return res.status(404).json({
        message: `404 Not Found. No se encuentra el producto con id: ${id} en la base de datos.`
    })
})



router.delete('/:pid', async (req, res) => {
    let id = req.params.pid
    let quePaso = await pm.deleteProduct(id)
    let products = await pm.getProduct()
    if (quePaso) {
        let eliminado = await pm.getProductById(id)
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({
            message: `Todo ok... producto con id ${id} eliminado: ${eliminado.title}`,
            products
        })
    }
    res.setHeader('Content-Type', 'application/json')
    res.status(404).json({
        message: `404 Not Found. No se encontro el producto con id ${idProduct}`,
        products
    })

})

module.exports = router