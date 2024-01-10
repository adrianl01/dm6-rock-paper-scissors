import "./comps/welcome/index"
import "./comps/game-room/index"
import "./comps/new-game/index"
import "./comps/instructions/index"
import "./comps/game/index"
import { Router } from "@vaadin/router";


const root = document.querySelector(".root")
const router = new Router(root);
router.setRoutes([
    { path: "/", component: "welc-el" },
    { path: "/gameroom", component: "game-room-el" },
    { path: "/newgame", component: "new-game-el" },
    { path: "/instructions", component: "inst-el" },
    { path: "/game", component: "game-el" },
]);