import { Router } from 'express';
import { Schema, model } from 'mongoose';
const router = Router();

const codeShare = Schema({
    description: String,
    
});

const Store= new model("Store", codeShare);

//Store a Code
router.post('/code_share', async(req,res)=>{

    const newStore = new Store(req.body);
    
    try {
        await newStore.save();
        res.status(200).json({
            message: "Code Stored successfully!",
            id: newStore._id
        });
    } catch (err) {
        res.status(500).json({
            error: "There was an error!",
        });
    }
});

//GET A CODE BY ID
router.get('/code_share/:id', async(req,res)=>{
    try{
        const data = await Store.find({_id: req.params.id}).select({
            _id:0,
            description:1
        });
        res.status(200).json({
            message: "Get successfully",
            result: data,
        });
    }catch{
        res.status(500).json({
            message: "There was an error..",
        });
    }
});
export default router;