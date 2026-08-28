import { useNavigate } from "react-router-dom";
import { PresentationRuntime } from "./components/PresentationRuntime";
import { mockPresentation } from "./mock";

export function PresentationRuntimePage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen">
      <PresentationRuntime artifact={mockPresentation} onExit={() => navigate(-1)} />
    </div>
  );
}
