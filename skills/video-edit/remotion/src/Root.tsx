import { AbsoluteFill, Composition, staticFile } from "remotion";
import { EditedVideo, type EditedVideoProps } from "./EditedVideo";
import { StyleShowcase } from "./StyleShowcase";
import { HiggsIntro } from "./HiggsIntro";
import { VideoEditIntro } from "./VideoEditIntro";
import { FishIntro } from "./FishIntro";
import { FishIntro3 } from "./FishIntro3";
import { FishIntro2 } from "./FishIntro2";
import { DarkGridBg, LightGridBg } from "./templates/Backgrounds";
import { PromptMachineShort } from "./shorts/PromptMachineShort";
import { StoppedCheckingShort } from "./shorts/StoppedCheckingShort";
import { LessIsMoreShort } from "./shorts/LessIsMoreShort";
import { LeftLovableShort } from "./shorts/LeftLovableShort";
import { AiLonelyShort } from "./shorts/AiLonelyShort";
import { AiEmployeeIntro } from "./shorts/AiEmployeeIntro";
import { MachineIntro } from "./shorts/MachineIntro";
import { WaveIntro } from "./shorts/WaveIntro";
import { YtIntro } from "./shorts/YtIntro";
import { BillShowcase } from "./shorts/BillShowcase";
import { EditShowcase } from "./shorts/EditShowcase";
import { SubscribeBreak } from "./shorts/SubscribeBreak";
import { OutroCredits } from "./shorts/OutroCredits";
import { Plan, planDuration } from "./motion/Plan";
import demoPlan from "./motion/showcase-plan.json";
import overlayPlan from "./motion/overlay-plan.json";
import props from "./props.json";

const demoScenes = (demoPlan as { scenes: { durationInFrames: number }[] }).scenes;
const overlayScenes = (overlayPlan as { scenes: { durationInFrames: number }[] }).scenes;

const DarkGridFrame = () => <AbsoluteFill><DarkGridBg /></AbsoluteFill>;
const LightGridFrame = () => <AbsoluteFill><LightGridBg /></AbsoluteFill>;

const typed = props as unknown as EditedVideoProps & {
  fps: number;
  width: number;
  height: number;
  durationInFrames: number;
};

export const Root: React.FC = () => {
  return (
    <>
      <Composition id="OutroCredits" component={OutroCredits} durationInFrames={241} fps={30} width={3840} height={2160} />
      <Composition id="SubscribeBreak" component={SubscribeBreak} durationInFrames={305} fps={30} width={3840} height={2160} />
      <Composition id="EditShowcase" component={EditShowcase} durationInFrames={1620} fps={30} width={1920} height={1080} />
      <Composition id="BillShowcase" component={BillShowcase} durationInFrames={1375} fps={30} width={1080} height={1920} />
      <Composition id="AiEmployeeIntro" component={AiEmployeeIntro} durationInFrames={445} fps={30} width={1920} height={1080} />
      <Composition id="MachineIntro" component={MachineIntro} durationInFrames={352} fps={30} width={3840} height={2160} />
      <Composition id="WaveIntro" component={WaveIntro} durationInFrames={383} fps={30} width={1080} height={1920} />
      <Composition id="YtIntro" component={YtIntro} durationInFrames={242} fps={30} width={1080} height={1920} />
      <Composition id="PromptMachineShort" component={PromptMachineShort} durationInFrames={2511} fps={30} width={1080} height={1920} />
      <Composition id="StoppedCheckingShort" component={StoppedCheckingShort} durationInFrames={1662} fps={30} width={1080} height={1920} />
      <Composition id="LessIsMoreShort" component={LessIsMoreShort} durationInFrames={1134} fps={30} width={1080} height={1920} />
      <Composition id="LeftLovableShort" component={LeftLovableShort} durationInFrames={1404} fps={30} width={1080} height={1920} />
      <Composition id="AiLonelyShort" component={AiLonelyShort} durationInFrames={1725} fps={30} width={1080} height={1920} />
      <Composition
        id="FishIntro2"
        component={FishIntro2}
        durationInFrames={1491}
        fps={30}
        width={3840}
        height={2160}
      />
      <Composition
        id="FishIntro3"
        component={FishIntro3}
        durationInFrames={1144}
        fps={30}
        width={3840}
        height={2160}
      />
      <Composition
        id="FishIntro"
        component={FishIntro}
        durationInFrames={1348}
        fps={30}
        width={3840}
        height={2160}
      />
      <Composition
        id="VideoEditIntro"
        component={VideoEditIntro}
        durationInFrames={708}
        fps={30}
        width={3840}
        height={2160}
      />
      <Composition
        id="HiggsIntro"
        component={HiggsIntro}
        durationInFrames={766}
        fps={30}
        width={3840}
        height={2160}
      />
      <Composition
        id="EditedVideo"
        component={EditedVideo}
        durationInFrames={typed.durationInFrames}
        fps={typed.fps}
        width={typed.width}
        height={typed.height}
        defaultProps={typed}
      />
      <Composition
        id="CinematicDemo"
        component={Plan as never}
        durationInFrames={planDuration(demoScenes)}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ scenes: demoScenes } as never}
      />
      <Composition
        id="OverlayDemo"
        component={Plan as never}
        durationInFrames={planDuration(overlayScenes, false)}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ scenes: overlayScenes, transparent: true } as never}
      />
      <Composition
        id="StyleShowcase"
        component={StyleShowcase}
        durationInFrames={30 * 125}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* 16:9 variant for verifying landscape templates side-by-side. */}
      <Composition
        id="StyleShowcaseLandscape"
        component={StyleShowcase}
        durationInFrames={30 * 125}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="DarkGridFrame"
        component={DarkGridFrame}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="LightGridFrame"
        component={LightGridFrame}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};

// Re-exported so Remotion picks it up
export { staticFile };
