import { Card, NumbersComparison, ResultDetails, SimulationForm, Summary } from './components';

export function SimulationContainer() {
  return (
    <div className="h-full min-h-full flex items-center justify-center p-4 md:p-6">
      <Card>
        <Summary />
        <ResultDetails />
        <NumbersComparison />
        <SimulationForm />
      </Card>
    </div>
  );
}
