import { Animator, State } from "./Animator";

export class ComposeAnimator extends Animator {
    state: number = 0;
    private animators: Animator[];

    constructor(animators: Animator[]) {
        super();
        this.animators = animators
    }

    init(rows: number, columns: number) {
        super.init(rows, columns);
        this.animators.forEach((animator) => animator.init(rows, columns))
    }

    hasFinished(): boolean {
        return this.state == this.animators.length;
    }

    nextState(): State[][] {
        let nextState =  this.animators[this.state].nextState();
        if (this.animators[this.state].hasFinished()){
            this.state ++
        }
        return nextState
    }

    restart(): void {
        this.animators.forEach((animator) => animator.restart())
        this.state = 0;
    }

}