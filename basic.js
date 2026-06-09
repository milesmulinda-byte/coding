// function echo (text) {
//     console.log(text);
// }
// echo("Hello Miles !")

// let variable = 1;
// let variable2 = 2;
// let result = variable + variable2;
// console.log(result);

// const readline = require('readline');
// const rl = readline.createInterface({ input: process.stdin });
// rl.question("Enter first number: ", (number1)  => {
//     rl.question("Enter second number: ", (number2) => {
//         console.log(parseInt(number1) + parseInt(number2));
//     rl.close();
//     });
// });

// const readline = require('readline');
// const rl = readline.createInterface({ input: process.stdin});
// rl.question ("What is the temperature in Celsius? ", (celsius) => {
//     const fahrenheit = (parseFloat(celsius) * 9/5) + 32;
//     console.log('The temperature in Fahrenheit is: ' + fahrenheit);
//     rl.close();
// });

// const readline = require('readline');
// const rl = readline.createInterface({input: process.stdin});
// rl.question("What is the temperature in Farenheit? ", (farenheit) => {
//     const celsius = (parseFloat(farenheit) * 5/9) -32;
//     console.log('The temperature in Celsius is: ' + celsius);
//     rl.close();

// });

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question("What is the width of the rectangle? ", (width) => {
    rl.question("What is the length of the rectangle? ", (length) => {
        console.log('The area of the rectangle is: ' + (parseInt(width) * parseInt(length)));
        rl.close();
    });
});
