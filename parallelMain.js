import { exit } from "process";
import { Worker } from "worker_threads";
import chalk from "chalk";
import os from "os";

function run(count, type) {
  let countOfWorkers = os.cpus().length;
  return new Promise((resolve, reject) => {
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
  });
}

async function print(type, result) {
  console.log(chalk.bgBlue.bold(type));
  console.log(
    `Количество элементов: ${chalk.yellow.bold(result.count)}\n` +
      `Сумма: ${chalk.yellow.bold(result.sum)}\n` +
      `Среднее время выполнения ${chalk.yellow.bold(result.time + "ms")}`
  );
}

async function main() {
  let from = 4096;
  let to = 512 * from;
  for (let i = from; i < to; i *= 2) {
    let result = await run(i, "default");
    print("Обычная", result);
  }
  for (let i = from; i < to; i *= 2) {
    let result = await run(i, "onlyException");
    print("Только Исключения", result);
  }
  for (let i = from; i < to; i *= 2) {
    let result = await run(i, "withoutException");
    print("Без исключений", result);
  }
}

main();
