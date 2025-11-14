import { lusitana } from '@/app/ui/fonts';
import { SparklesIcon, CalendarIcon } from '@heroicons/react/24/outline';

export default function WelcomeHeader() {
  const currentDate = new Date();
  const timeOfDay = currentDate.getHours() < 12 ? 'Bonjour' : currentDate.getHours() < 18 ? 'Bon après-midi' : 'Bonsoir';
  
  return (
    <div className="mb-8">
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 rounded-3xl p-8 shadow-2xl">
        {/* Effet de background */}
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <SparklesIcon className="w-8 h-8 text-yellow-300" />
                <span className="text-yellow-300 font-medium text-lg">HabitFlow</span>
              </div>
              
              <h1 className={`${lusitana.className} text-4xl md:text-5xl font-bold text-white mb-2`}>
                {timeOfDay} ! 👋
              </h1>
              
              <p className="text-pink-100 text-xl mb-4">
                Prêt à conquérir vos habitudes aujourd&apos;hui ?
              </p>
              
              <div className="flex items-center gap-2 text-pink-100">
                <CalendarIcon className="w-5 h-5" />
                <span className="text-sm">
                  {currentDate.toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
            
            {/* Badge de streak */}
            <div className="bg-white/20 backdrop-blur rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold text-white">7</div>
              <div className="text-pink-100 text-sm">jours de suite</div>
              <div className="text-yellow-300 text-xs">🔥 En feu&nbsp;!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}