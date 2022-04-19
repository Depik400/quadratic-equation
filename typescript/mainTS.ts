import {performance} from "perf_hooks";
import {appendFile} from "fs";
import chalk from "chalk";

const sqrt = Math.sqrt;

function isEqual(a: number, b: number, e: number = 0.00001): boolean {
    return Math.abs(a - b) < e;
}

function argsEqualsNull(a: number, b: number, c: number): boolean {
    if (isEqual(a, 0) && isEqual(b, 0) && isEqual(c, 0)) {
        return true;
    }
    return false;
}

function sumRoots(result: Array<number | void>): number {
    if (result.length == 0) return Number(0);
    if (result.length == 1) return Number(result[0]);
    let sum: number = 0;
    result.forEach((item: number) => sum += item);
    return sum;
}

class rootException extends Error {
    private roots: Array<number|void>;

    constructor(root: Array<number|void>) {
        super();
        this.roots = root;
    }

    public getRoots(): Array<number|void> {
        return this.roots;
    }
}

interface arguments {
    a: number,
    b: number,
    c: number,
}

function solver(args: arguments): Array<number | void> {
    if (isEqual(args.a, 0) && isEqual(args.b, 0)) {
        return [];
    }
    if (isEqual(args.a, 0)) {
        return [
            0,
            (-args.c) / args.b
        ]
    }

    let sqrB: number = args.b ** 2;
    let D: number = sqrB - (args.a * args.c * 4);

    if (isEqual(D, 0)) {
        return [0, -args.b / (2 * args.a)];
    }

    if (D < 0) {
        return []
    }

    return [
        (-args.b + sqrt(D)) / (2 * args.a),
        (-args.b - sqrt(D)) / (2 * args.a),
    ];
}

function solve(args:arguments): Array<number|void> {
    if (argsEqualsNull(args.a, args.b, args.c)) {
        throw new Error("ArgsIsNull");
    }
    return solver(args);
}

function exceptionSolve(args:arguments) : void {
    if (argsEqualsNull(args.a, args.b, args.c)) {
        throw new Error("ArgsIsNull");
    }
    let result: Array<number|void> = solver(args);
    throw new rootException(result);
}

interface errorLess {
    array: Array<number|void>,
    status: boolean
}

function nonExceptionSolve(args: arguments) : errorLess  {
    if (argsEqualsNull(args.a, args.b, args.c)) {
        return { array: [], status: false };
    }
    return { array: solver(args), status: true };
}

function rootsSumSolve(args : arguments) : number {
    try {
        let result: Array<number|void> = solve(args);
        return sumRoots(result);
    } catch (err:any) {

        if (err == "ArgsIsNull") {
            return 0;
        }
        return 0;
    }
}

function rootsSumSolveException(args) : number {
    try {
        exceptionSolve(args);
    } catch (err : rootException | any) {
        if (err == "ArgsIsNull") {
            return 0;
        }

        if ( err instanceof rootException) {
            return sumRoots(err.getRoots());
        }

        return 0;
    }
}
function rootsSumSolveNonException(args: arguments) : number {
    let result : errorLess = nonExceptionSolve(args);
    if (result.status) {
        return sumRoots(result.array);
    }
    return 0;
}

function execute(count: number, func: Function) : number {
    let sum : number = 0;
    global.gc();
    let start_time : number = performance.now();
    for (let i : number = 0; i < count; i++) {
        let args: arguments = {
            a: ((i % 2000) - 1000) / 33.0,
            b: ((i % 200) - 100) / 22.0,
            c: ((i % 20) - 10) / 11.0,
        };
        sum += func(args) ;
    }
    let end_time : number = performance.now();
    appendFile('sum.txt',String(sum),(err) => {});
    return (end_time - start_time);
}

async function main() {
    const from = 32768;
    const to = 512 * 4096;
    console.log(chalk.bgBlue.bold("Обычная"));
    for (let i = from; i <= to; i *= 2) {
        let time = execute(i, rootsSumSolve);
        console.log(`${i}\t${(time)}`)
    }
    console.log(chalk.bgBlue.bold("Только исключения"));
    for (let i = from; i <= to; i *= 2) {
        let time = execute(i, rootsSumSolveException);
        console.log(`${i}\t${time}`)
    }
    console.log(chalk.bgBlue.bold("Без исключений"));
    for (let i = from; i <= to; i *= 2) {
        let time = execute(i, rootsSumSolveNonException);
        console.log(`${i}\t${time}`)
    }
}

main();

