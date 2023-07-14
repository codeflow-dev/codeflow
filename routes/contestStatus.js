import { Router } from "express";
import Contest from "../models/contest.js";
const router = Router();

router.get("/contests/upcoming",async(req,res)=>{
  try{
    const upcoming=await Contest.find({startDate:{$gt:new Date()}})
    res.status(200).json(upcoming)
  } catch(err){
    res.status(500).json({message: err.message})
  }
})

router.get("/contests/past",async(req,res)=>{
  try{
    const past=await Contest.find({startDate:{$lt:new Date()}})
    res.status(200).json(past)
  } catch(err){
    res.status(500).json({message: err.message})
  }
})
export default router;
