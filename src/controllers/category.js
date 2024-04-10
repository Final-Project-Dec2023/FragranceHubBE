import Category from "../models/category.js";
import slugify from "slugify";

export const createCategory = async (req, res)=>{
    try {
        const { name } = req.body
        if(!name){
            return res.status(400).json("Name is required")
        }

        const existingCategory = await Category.findOne({name});
        if (existingCategory) {
            return res.status(401).json({ error: "Category already exists" });
          }

          const category = await new Category({ name, slug: slugify(name) }).save()

          res.json({success: true, message: "Category created successfully", category})

        
    } catch (err) {
        console.log(err);
        res.status(500).json({success: false, message: "Internal Server Error", errMsg: err.message});
    }
}



// getAllCategory

// getOneCategory

// updateCategory

// deleteCategory









