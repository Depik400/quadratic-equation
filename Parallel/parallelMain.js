import { Worker } from "worker_threads";
import chalk from "chalk";
import os from "os";

function run(count, type) {
    let countOfWorkers = os.cpus().length;
    //return new Promise((resolve, reject) => {
    let workers = [];
    let times = [];
    let sums = [];
    let counter = 0;
    for (let i = 0; i < countOfWorkers; i++) {
        let settings = {
            workerData: {
                count: count,
                id: i,
                type: type,
                countOfWorkers: countOfWorkers,
            },
        };
        let worker = new Worker("./worker.js", settings);
        worker.on("message", (msg) => {
            sums.push(msg.sum);
            times.push(msg.time);
            counter++;
            if (counter == workers.length) {
                resolve({
                    sum: sums.reduce((a, b) => a + b),
                    time: times.reduce((a, b) => a + b) / countOfWorkers,
                    count: count,
                });
            }
        });
        workers.push(worker);
    }

    //});
}

async function print(from, result) {
    console.log(`${from}\t${Math.floor(result.time*10**5)/10**5}`);
}

async function main() {
    let from = 4096;
    let to = 512 * from;
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