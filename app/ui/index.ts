// Barrel export pour simplifier les imports des composants UI
// Utilisez : import { Button, LoginForm, HabitLogo } from '@/app/ui';

// Common
export { Button } from './common/button';
export { default as Search } from './common/search';
export { default as LogoutButton } from './common/logout-button';
export * from './common/xp-bar';
export * from './common/level-progress-bar';
export * from './common/skeletons';

// Forms
export { default as LoginForm } from './forms/login-form';
export { default as SignupForm } from './forms/signup-form';

// Icons
export { default as AcmeLogo } from './icons/acme-logo';
export { default as HabitLogo } from './icons/habit-logo';

// Modals
export * from './modals/level-up-modal';
export * from './modals/level-rewards-modal';

// Animations
export * from './animations/activity-animation-wrapper';
export * from './animations/animated-notification';
export * from './animations/challenge-animations';
export * from './animations/star-animations';

// Fonts
export * from './fonts';
