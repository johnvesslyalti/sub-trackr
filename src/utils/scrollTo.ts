export const smoothScrollTo = (target: string | HTMLElement) => {
  const lenis = window.lenis;
  if (!lenis) return;

  if (typeof target === 'string') {
    const element = document.querySelector(target);
    if (element instanceof HTMLElement) {
      lenis.scrollTo(element);
    }
  } else {
    lenis.scrollTo(target);
  }
};
