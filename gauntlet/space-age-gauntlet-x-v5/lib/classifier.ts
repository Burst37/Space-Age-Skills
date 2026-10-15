import { TaskType } from "./types";
export function classifyTask(goal:string):TaskType{
  const g=goal.toLowerCase();
  const tests:[RegExp,TaskType][]=[
    [/website|landing page|ui\b|ux\b|frontend|web app|homepage|site\b/,"Website / UI"],
    [/skill\b|agent\b|prompt\b|llm|workflow|orchestrator/,"AI Skill / Agent"],
    [/research|report|analysis|study|literature|evidence/,"Research"],
    [/video|film|motion|animation|storyboard|cinematic/,"Video / Motion"],
    [/campaign|copy|marketing|advert|brand strategy|sales page/,"Marketing / Copy"],
    [/app\b|software|api\b|backend|database|codebase|service/,"Software / App"],
    [/image|visual|artwork|poster|creative direction|design asset/,"Creative / Visual"]
  ];
  return tests.find(([r])=>r.test(g))?.[1]??"General";
}
