import chalk from "chalk";
import { performance } from 'perf_hooks';
import fs from "fs";

const sqrt = Math.sqrt;

function isEqual(a, b, e = 0.00001) {
    return Math.abs(a - b) < e;
}

function argsEqualsNull(a, b, c) {
    if (isEqual(a, 0) && isEqual(b, 0) && isEqual(c, 0)) {
        return true;
    }
    return false;
}

function sumRoots(result) {
    if (result.length == 0) return Number(0);
    if (result.length == 1) return Number(result[0]);
    let sum = 0;
    result.forEach((item) => sum += item - 1 + 1);
    return sum;
}

function rootException(roots) {
    this.roots = roots;
}

function solver(args) {

    if(isEqual(args.a, 0) && isEqual(args.b,0))
        return [];

    if (isEqual(args.a, 0)) {
        return [0,(-args.c) / args.b];
    }
    let sqrB = args.b * args.b;
    let D = sqrB - (args.a * args.c * 4);

    if (isEqual(D, 0)) {
        return [0,-args.b / (2 * args.a)];
    }
    if (D < 0) {
        return [];
    }

    return [
        (-args.b + sqrt(D)) / (2 * args.a),
        (-args.b - sqrt(D)) / (2 * args.a),
    ];
}

function solve(args) {
    if (argsEqualsNull(args.a, args.b, args.c)) {
        throw new Error("ArgsIsNull");
    }
    let result = solver(args);
    return result;
}

function exceptionSolve(args) {
    if (argsEqualsNull(args.a, args.b, args.c)) {
        throw new Error("ArgsIsNull");
    }
    let result = solver(args);

    throw new rootException(result);
}

function nonExceptionSolve(args) {
    if (argsEqualsNull(args.a, args.b, args.c)) {
        return { array: [], status: false };
    }
    let result = solver(args);
    return { array: result, status: true };
}

function rootsSumSolve(args) {
    try {
        let result = solve(args);

        let sum = sumRoots(result);
        return sum;
    } catch (err) {

        if (err == "ArgsIsNull") {
            return 0;
        }
        return 0;
    }
}

function rootsSumSolveException(args) {
    try {
        exceptionSolve(args);
    } catch (err) {
        if (err == "ArgsIsNull") {
            return 0;
        }

        if (err.roots != undefined) {
            return sumRoots(err.roots);
        }

        return 0;
    }
}

function rootsSumSolveNonException(args) {
    let result = nonExceptionSolve(args);
    if (result.status) {
        return sumRoots(result.array);
    }
    return 0;
}

function execute(count, func) {
    let sum = 0;
    global.gc();
    let start_time = performance.now();
    for (let i = 0; i < count; i++) {
        let args = {
            a: ((i % 2000) - 1000) / 33.0,
            b: ((i % 200) - 100) / 22.0,
            c: ((i % 20) - 10) / 11.0,
        };
        sum += func(args) ;
    }
    let end_time = performance.now();
    fs.appendFile('sum.txt',String(sum),(err) => {});
    return (end_time - start_time);
}

async function main() {
    const from = 32768;
    const to = 512 * 4096;
    console.log(chalk.bgBlue.bold("Обычная"));
    for (let i = to; i >= from; i /= 2) {
        let time = execute(i, rootsSumSolve);
        console.log(`${i}\t${(time)}`)
    }
    console.log(chalk.bgBlue.bold("Только исключения"));
    for (let i = to; i >= from; i /= 2) {
        let time = execute(i, rootsSumSolveException);
        console.log(`${i}\t${time}`)
    }
    console.log(chalk.bgBlue.bold("Без исключений"));
    for (let i = to; i >= from; i /= 2) {
        let time = execute(i, rootsSumSolveNonException);
        console.log(`${i}\t${time}`)
    }
}

main();