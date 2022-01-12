import { Animator, State } from "./Animator";
import { WallClock } from "../WallClock";

export class ComposeAnimator extends Animator {
    state: number = 0;
    private animators: Animator[];

    constructor(animators: Animator[], freezeTime: number) {
        super(freezeTime);
        this.animators = animators
    }

    init(wallClick : WallClock) {
        super.init(wallClick);
        this.animators.forEach((animator) => animator.init(wallClick))
    }

    hasFinished(): boolean {
        return this.state == this.animators.length;
    }

    internalNextState(currentState: State[][]): State[][] {
        let nextState = this.animators[this.state].nextState(currentState);
        if (this.animators[this.state].hasFinished()) {
            this.state++
        }
        return nextState
    }

    restart(): void {
        this.animators.forEach((animator) => animator.restart())
        this.state = 0;
    }

}