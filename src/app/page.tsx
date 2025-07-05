import { TipCalculator } from '@/components/tip-calculator';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8 gap-10 font-sans">
      <h1 className="text-3xl font-bold uppercase tracking-[0.3em] text-muted-foreground text-center">
        Tip<br />Split
      </h1>
      <TipCalculator />
    </main>
  );
}
