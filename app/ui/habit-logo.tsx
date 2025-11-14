import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function HabitLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <CheckCircleIcon className="h-12 w-12 mr-3" />
      <p className="text-[44px] font-bold">HabitTracker</p>
    </div>
  );
}