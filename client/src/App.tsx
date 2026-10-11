import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MotionConfig } from "framer-motion";
import ErrorBoundary from "./components/ErrorBoundary";
import Blogs from "./pages/Blogs";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Podcast from "./pages/Podcast";
import Projects from "./pages/Projects";

function App() {
  const pages = {
    "/": <Home />,
    "/404": <NotFound />,
    "/projects": <Projects />,
    "/blogs": <Blogs />,
    "/podcast": <Podcast />,
  } as const;
  const page = pages[window.location.pathname as keyof typeof pages] ?? <NotFound />;

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
