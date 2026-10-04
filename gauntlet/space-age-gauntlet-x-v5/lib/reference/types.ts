export type ReferenceAssetKind = "screenshot" | "video";

export interface ReferenceAssetMeta {
  name:string;
  mimeType:string;
  kind:ReferenceAssetKind;
  size:number;
}

export interface MotionPrimitive {
  name:string;
  trigger:string;
  behavior:string;
  timing:string;
  easing:string;
  implementationHint:string;
}

export interface ReferenceDNA {
  sourceSummary:string;
  visual:{
    layout:string[];
    typography:string[];
    colorAndSurface:string[];
    imagery:string[];
    spacingAndRhythm:string[];
  };
  motion:{
    scrollModel:string;
    primitives:MotionPrimitive[];
    choreography:string[];
    performanceNotes:string[];
  };
  interaction:{
    navigation:string[];
    hover:string[];
    cursor:string[];
    microinteractions:string[];
  };
  implementation:{
    likelyTechniques:string[];
    gsapMapping:string[];
    cssMapping:string[];
    responsiveBehavior:string[];
  };
  transformation:{
    adopt:string[];
    transformIntoOwnStyle:string[];
    doNotCopy:string[];
  };
  confidence:{
    overall:number;
    limitations:string[];
  };
}
