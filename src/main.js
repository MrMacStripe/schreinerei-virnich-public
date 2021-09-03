import Alpine from 'alpinejs'
import intersect from '@alpinejs/intersect'
import persist from '@alpinejs/persist'
import trap from '@alpinejs/trap'
import Splide from '@splidejs/splide'
window.Splide = Splide

/* === === === === === */
/* === Alpine JS ===*/
/* === === === === === */
Alpine.plugin(intersect)
Alpine.plugin(persist)
Alpine.plugin(trap)
Alpine.start() 

