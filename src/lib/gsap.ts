import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Keep GSAP's internal tickers tidy across route-less section rebuilds.
gsap.defaults({ overwrite: "auto" });

export { gsap, ScrollTrigger };
