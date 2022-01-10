import { WallClock } from './WallClock';
import '../style/app.scss';
import { DialsHourAnimator } from './animators/DialsHourAnimator';
import { LinesAnimator } from './animators/LinesAnimator';
import { State } from './animators/Animator';
import { DigitalHourAnimator } from './animators/DigitalHourAnimator';
import { WaveAnimator } from "./animators/WaveAnimator";
import { MagneticLinesAnimator } from "./animators/MagneticLinesAnimator";
import { ComposeAnimator } from "./animators/ComposeAnimator";
import { Magnet } from "./animators/Magnet";

const root = document.getElementById('wall') as HTMLCanvasElement
const background = document.getElementById('background') as HTMLCanvasElement


const app = new WallClock(
    root,
    background,
    [
        new LinesAnimator(State.OFF),
        new WaveAnimator(),
        new DialsHourAnimator(),
        new ComposeAnimator(
            [
                new LinesAnimator(new State(0, Math.PI)),
                new LinesAnimator(new State(Math.PI / 2, Math.PI * 3 / 2)),
                new LinesAnimator(new State(Math.PI, 0)),
            ]
        ),
        new MagneticLinesAnimator(),
        new DigitalHourAnimator(),
        new Magnet()
    ]
)

let resizeId: ReturnType<typeof setTimeout>

function resizedEnded() {
    app.resize()
}

window.addEventListener('resize', () => {
    clearTimeout(resizeId);
    resizeId = setTimeout(resizedEnded, 500);
}, false);

app.start()