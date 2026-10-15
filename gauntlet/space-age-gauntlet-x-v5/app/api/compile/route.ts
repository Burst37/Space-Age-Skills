import { NextRequest, NextResponse } from "next/server";
import { compileGauntlet, makeRunnerConfig } from "@/lib/compiler";
import { CompileInput } from "@/lib/types";

export async function POST(req:NextRequest){
  try{
    const input=await req.json() as CompileInput;
    if(!input.goal?.trim()) return NextResponse.json({error:"Goal is required."},{status:400});
    const plan=compileGauntlet(input);
    return NextResponse.json({...plan,runnerConfig:makeRunnerConfig(input,plan)});
  }catch(e){
    return NextResponse.json({error:e instanceof Error?e.message:"Compilation failed."},{status:500});
  }
}
