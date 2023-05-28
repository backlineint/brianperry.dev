import confetti from 'https://cdn.skypack.dev/canvas-confetti';

const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

if (!mediaQuery.matches) {
    confetti();
    console.log("I hope you enjoyed this unnecessary confetti");
}