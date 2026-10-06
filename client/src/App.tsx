import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MotionConfig } from "framer-motion";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

function App() {
  const page = window.location.pathname === "/404" ? <NotFound /> : <Home />;

  return (
    <ErrorBoundary>
      <TooltipProvider>
        <Toaster />
        <MotionConfig reducedMotion="user">{page}</MotionConfig>
      </TooltipProvider>
    </ErrorBoundary>
  );
}

export default App;
