import { ListChecks } from 'lucide-react';

export function AppLogo() {
  return (
    <div className="flex items-center gap-2">
      <ListChecks className="h-6 w-6 text-primary" />
      <h1 className="text-xl font-bold font-headline tracking-tighter text-foreground">TaskMaster Pro</h1>
    </div>
  );
}
