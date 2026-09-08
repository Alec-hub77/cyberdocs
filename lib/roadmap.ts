import fs from "fs";
import path from "path";
import type { RoadmapStage } from "./types";

export function getRoadmap(): RoadmapStage[] {
  const filePath = path.join(process.cwd(), "content", "roadmap", "roadmap.json");
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

export function getRoadmapItemCount(roadmap: RoadmapStage[]): number {
  return roadmap.reduce((sum, stage) => sum + stage.items.length, 0);
}
