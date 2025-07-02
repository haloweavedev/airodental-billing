import { StepperSidebar } from '@/components/onboarding/stepper-sidebar';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white">
      <StepperSidebar />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
} 