import { WallClock } from './WallClock';
import '../style/app.scss';
import { HourAnimator } from './animators/HourAnimator';
import { LinesAnimator } from './animators/LinesAnimator';
import { State } from './animators/Animator';

const root = document.getElementById('wall') as HTMLCanvasElement


const app = new WallClock(root,
    [
        new LinesAnimator(State.OFF),
        new HourAnimator(),
        new LinesAnimator(new State(0,Math.PI)),
        new LinesAnimator(new State( Math.PI / 2, Math.PI * 3 / 2)),
        new LinesAnimator(new State(Math.PI, 0)),
        new LinesAnimator(new State( Math.PI * 3 / 2, Math.PI / 2)),
        new LinesAnimator(new State(0,Math.PI)),
    ]
)

app.start()