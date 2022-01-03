import { WallClock } from './WallClock';
import '../style/app.scss';
import { DialsHourAnimator } from './animators/DialsHourAnimator';
import { LinesAnimator } from './animators/LinesAnimator';
import { State } from './animators/Animator';
import { DigitalHourAnimator } from './animators/DigitalHourAnimator';

const root = document.getElementById('wall') as HTMLCanvasElement


const app = new WallClock(root,
    [
        new LinesAnimator(State.OFF),
        new DialsHourAnimator(),
        new LinesAnimator(new State(0,Math.PI), 0 ),
        new LinesAnimator(new State( Math.PI / 2, Math.PI * 3 / 2), 0 ),
        new LinesAnimator(new State(Math.PI, 0), 0 ),
        new LinesAnimator(new State( Math.PI * 3 / 2, Math.PI / 2), 0 ),
        new LinesAnimator(new State(0,Math.PI)),
        new DigitalHourAnimator()
    ]
)

app.start()