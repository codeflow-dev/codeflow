import { Router } from "express";
import Contest from "../models/contest.js";

const router=Router()

router.get("/admin",async(req,res)=>{
  try{
    const info=await Contest.find({published:false}).populate("problems")
    const contestInfo=info.map((contest) => ({
      contestName: `Codeflow ${contest.level} Contest ${contest.round}`,
      contestId:contest._id.toString(),
      problems: contest.problems.map((problem) => ({
        problemId:problem.id,
      })),
    }))
    //  console.log({contestInfo})
    res.status(200).json(contestInfo)
  } catch(err){
    console.error(err)
    res.status(500).json({message:"Failed to fetch contests"})
  }
})

router.post("/admin/accept/:id",async(req,res)=>{
  try{
    const id=req.params.id
    console.log({id})
    const date=new Date(req.body.date)

    await Contest.findByIdAndUpdate(id,{published:true, contestDate:date})
    res.status(200).json({message:"Contest is accepted!!!"})
  } catch(err){
    console.error(err)
    res.status(500).json({message:"Failed to accept the contest"})
  }
})

router.delete("/admin/reject/:id",async(req,res)=>{
  try{
    const id=req.params.id
    await Contest.findByIdAndDelete(id)
    res.status(200).json({message:"Contest is rejected"})
  } catch(err){
    console.log(err)
    res.status(500).json({message:"Failed to reject"})
  }
})
export default router

