import Alpine from 'alpinejs'
import intersect from '@alpinejs/intersect'
import persist from '@alpinejs/persist'
import trap from '@alpinejs/trap'
/* === === === === === */
/* === Alpine JS ===*/
/* === === === === === */
Alpine.plugin(intersect)
Alpine.plugin(persist)
Alpine.plugin(trap)
Alpine.start()

/* === === === === === */
/* === GlideJS ===*/
/* === === === === === */
import Glide from '@glidejs/glide'
new Glide('.glide', {
  perView: 3,
  gap: 12,
  bound: true,
  rewind: false,
  touchRatio: 1,
  animationDuration: 300,
  // animationTimingFunc: 'ease-out',
  swipeThreshold: 16,
  peek: { before: 16, after: 100 },
  throttle: 1,
  breakpoints: {
    1024: {
      perView: 2
    },
    600: {
      perView: 1,
      peek: { before: 16, after: 64 },
    }
  }
}).mount()
