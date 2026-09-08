import RoadmapTrack from "@/components/roadmap/RoadmapTrack";
import { getRoadmap } from "@/lib/roadmap";

export const metadata = { title: "Roadmap — cyberdocs" };

export default function RoadmapPage() {
  const roadmap = getRoadmap();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-1 text-xl font-bold text-ink">Roadmap</h1>
      <p className="mb-6 text-sm text-muted">
        Послідовний план навчання. Позначайте пункти виконаними — прогрес зберігається у вашому браузері.
      </p>
      <RoadmapTrack roadmap={roadmap} />
    </div>
  );
}
