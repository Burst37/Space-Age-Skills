// Project data. Each entry maps to a folder in ./Visuals/.
export const projects = [
  { name: "Northlight", category: "Portrait",    folder: "project-05", cover: "01.jpg" },
  { name: "Aperture",  category: "Photography", folder: "project-01", cover: "01.jpg" },
  { name: "Monolith",  category: "Architecture", folder: "project-02", cover: "01.jpg" },
  { name: "Still Life", category: "Editorial",   folder: "project-03", cover: "01.jpg" },
  { name: "Daylight",  category: "Interiors",    folder: "project-04", cover: "01.jpg" },
];

const CACHE_BUST = Date.now();
export const imgSrc = (p) => `Visuals/${p.folder}/${p.cover}?v=${CACHE_BUST}`;
export const imgAt  = (p, file) => `Visuals/${p.folder}/${file}?v=${CACHE_BUST}`;
