import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Predict from "@/pages/predict";
import Results from "@/pages/results";
import Scenarios from "@/pages/scenarios";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/predict" component={Predict} />
      <Route path="/results" component={Results} />
      <Route path="/scenarios" component={Scenarios} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
