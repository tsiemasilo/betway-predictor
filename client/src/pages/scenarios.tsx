import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, Calendar } from "lucide-react";
import type { MatchScenario } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

export default function Scenarios() {
  const [, navigate] = useLocation();

  const { data: scenarios, isLoading } = useQuery({
    queryKey: ["scenarios"],
    queryFn: async () => {
      const response = await fetch("/api/scenarios");
      if (!response.ok) throw new Error("Failed to fetch scenarios");
      return response.json() as Promise<MatchScenario[]>;
    },
  });

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/")} data-testid="button-back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-4xl font-black">Saved Scenarios</h1>
          </div>
          <Button onClick={() => navigate("/predict")} data-testid="button-new-prediction">
            <Plus className="h-5 w-5 mr-2" />
            New Prediction
          </Button>
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading scenarios...</p>
          </div>
        )}

        {!isLoading && scenarios && scenarios.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground text-lg mb-4">No scenarios saved yet</p>
            <Button onClick={() => navigate("/predict")} data-testid="button-create-first">
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Prediction
            </Button>
          </Card>
        )}

        {!isLoading && scenarios && scenarios.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scenarios.map((scenario) => (
              <Card key={scenario.id} className="p-6 hover:border-primary transition-all cursor-pointer" data-testid={`card-scenario-${scenario.id}`}>
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="outline">{scenario.competition}</Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(scenario.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{scenario.homeTeam}</h3>
                <p className="text-muted-foreground text-sm mb-2">vs</p>
                <h3 className="text-xl font-bold text-accent">{scenario.awayTeam}</h3>
                {scenario.predictionResults && typeof scenario.predictionResults === 'object' && 'probabilities' in scenario.predictionResults && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-xs text-muted-foreground">Home</p>
                        <p className="font-bold text-primary">
                          {((scenario.predictionResults as any).probabilities.home as number).toFixed(0)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Draw</p>
                        <p className="font-bold">
                          {((scenario.predictionResults as any).probabilities.draw as number).toFixed(0)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Away</p>
                        <p className="font-bold text-accent">
                          {((scenario.predictionResults as any).probabilities.away as number).toFixed(0)}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
