function promiseTest() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('lol');
    }, 5000);
  });
}
function promiseTest2() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('yeet');
    }, 6000);
  });
}

/* (async () => {
  let promiseTextReturned = await promiseTest();
  console.log(promiseTextReturned);
})(); */

/* Promise.all([promiseTest(), promiseTest(), promiseTest(), promiseTest2()]).then(
  (values) => {
    console.log(values);
  }
); */

/* (async () => {
  let promiseOutput = [];
  for (let i = 0; i < 3; i++) {
    promiseOutput.push(await promiseTest());
  }
  console.log(promiseOutput);
})(); */

/* (async () => {
  let promiseOutput = [];
  for (let i = 0; i < 3; i++) {
    promiseOutput.push(promiseTest());
  }
  console.log(promiseOutput);
})(); */

let promiseArray = [promiseTest, promiseTest, promiseTest, promiseTest2];

/* Promise.all(promiseArray.map((promise) => promise()))
  .then((values) => console.log(values))
  .catch((error) => console.log(error)); */

let promises = await Promise.all(
  promiseArray.map((promise) => promise().catch((error) => console.log(error)))
);
console.log(promises);
