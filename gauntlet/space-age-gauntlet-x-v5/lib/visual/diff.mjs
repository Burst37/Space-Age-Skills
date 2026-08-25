import fs from "node:fs/promises";
import path from "node:path";
export async function visualEvidenceSummary(currentShots=[],referenceDna=null){
  return {
    screenshots:currentShots,
    referenceDNA:referenceDna||null,
    requestedScores:[
      "techniqueFidelity",
      "originality",
      "visualQuality",
      "responsiveQuality",
      "motionFidelity"
    ]
  };
}
export function referenceAwareJudgePrompt(evidence){
  return `REFERENCE-AWARE VISUAL JUDGING

Evaluate candidate evidence against the supplied Reference DNA.

Score separately:
- techniqueFidelity: how well reusable mechanics were transferred
- originality: whether the candidate remains distinctly its own design
- visualQuality
- responsiveQuality
- motionFidelity

Literal copying should LOWER originality.
Failure to reproduce the intended interaction grammar should LOWER techniqueFidelity/motionFidelity.
Do not reward superficial color/layout similarity.

EVIDENCE
${JSON.stringify(evidence,null,2)}

Return strict JSON:
{"techniqueFidelity":0,"originality":0,"visualQuality":0,"responsiveQuality":0,"motionFidelity":0,"largestMismatch":"...","regressions":[],"passes":[]}`;
}
