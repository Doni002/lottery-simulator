import { Card, SimulationForm, SimulationResult } from './components';

export function SimulationContainer() {
  return (
    <div>
      <div>SimulationContainer</div>
      <Card>
        <SimulationResult />
        <SimulationForm />
      </Card>
    </div>
  );
}