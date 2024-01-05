import DefaultTheme from "vitepress/theme";

// @ts-ignore
import PlayGround from "./components/PlayGround.vue";
// @ts-ignore
// import ProjectCards from "./components/ProjectCards.vue";

import "./assets/styles.css";

export default {
    extends: DefaultTheme,
    enhanceApp(ctx) {
        ctx.app.component('PlayGround', PlayGround);
        // ctx.app.component('ProjectCards', ProjectCards);
    }
};