import Rating from "../models/rating.js"
import product from "../models/product.js"

export const rateProduct = async (req , res)=>{
    try {
        const { rating , review} = req.body
        const { productId} = req.params
        const userId = req.user
    // check if user has already reviewed the product
    const Product = await Product.findById(productId)
    const existingRating = product.rating.find((r)=>r.user.equals(userId))

    if(existingRating){
        // update rating
        existingRating.rating = rating
    }else{
        // add new rating
        product.rating.push({user: userId, rating: rating})
    }
    // save  the rating Db

    } catch (err) {
        console.log("Error rating product:", err.message);
        res.status(500).json({ success: false, message: "Failed to rate product", error: err.message });
    }
}