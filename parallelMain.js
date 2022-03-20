import { Worker } from "worker_threads";
import chalk from "chalk";
import os from "os";

function overs(count, id, countOfWorkers) {
    let leftover = count % countOfWorkers;
    if (leftover != 0) {
        count = count + (countOfWorkers - leftover);
    }
    let countForWorkers = count / countOfWorkers;
    return {
        left: id * countForWorkers,
        right: ((id - 1 + 2) * countForWorkers) - 1
    }
}

function run(count, type) {
    let countOfWorkers = os.cpus().length;
    return new Promise((resolve, reject) => {
        let times = [];
        let sums = [];
        let exitedWorkers = 0;

        let msgHandler = (msg) => {
            sums.push(msg.sum);
            times.push(msg.time);
            exitedWorkers++;
            if (exitedWorkers == countOfWorkers) {
                resolve({
                    sum: sums.reduce((a, b) => a + b),
                    time: times.reduce((a, b) => a + b) / countOfWorkers,
                    count: count,
                });
            }
        }

        for (let i = 0; i < countOfWorkers; i++) {
            let borders = overs(count, i, countOfWorkers);
            let settings = {
                workerData: {
                    left: borders.left,
                    right: borders.right,
                    type: type,
                    count: count,
                },
            };
            let worker = new Worker("./worker.js", settings);
            worker.on("message", msgHandler);
        }
    });
}

async function print(from, result) {
    console.log(`${from}\t${Math.floor(result.time*10**5)/10**5}`);
}

async function main() {
    let from = 32768;
    let to = 512 * 4096;
    console.log(chalk.bgBlue('Обычная'));
    for (let i = from; i <= to; i *= 2) {
        let result = await run(i, "default");
        print(i, result);
    }
    console.log(chalk.bgBlue('Только исключения'));
    for (let i = from; i <= to; i *= 2) {
        let result = await run(i, "onlyException");
        print(i, result);
    }
    console.log(chalk.bgBlue('Без исключений'));
    for (let i = from; i <= to; i *= 2) {
        let result = await run(i, "withoutException");
        print(i, result);
    }
}

main();