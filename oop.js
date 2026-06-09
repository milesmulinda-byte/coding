// class Car{
//     constructor(brand,color) {
//         // this used to get the values from input and assing to a specific variable
//         this.brand = brand;
//         this.color = color;
//     }

//     // create method that will help to acess the values of the variables
//     getBrand() {
//         console.log(`The brand name would be ${this.brand} `);

//     }
//     getColor() {
//         console.log(`The color of the car is ${this.color} `);
//     }
// }

// const carObject = new Car("Toyota", "blue")
// carObject.getBrand()
// carObject.getColor()


class Calculator{

 constructor (a,b){
    this.a =a;
    this.b = b;

     this.op = {
    "+":this.add,
    "-":this.sub,
    "/":this.div,
    "*":this.mul,
     } 

 }

     add (a,b) {this.result =this.a + this.b; return this; }
     sub (a,b) {this.result = this.a - this.b; return this; }
     div (a,b) {
     
    if (this.b === 0) {  //
        console.log("Error: divisor cannot be zero");
        return this;
    }
    this.result = this.a / this.b;
    return this;
}
    mul (a,b) {this.result = this.a * this.b; return this;}
    

       getResult() {
        console.log(`The result is: ${this.result}`);       // log it, and return it
    }
    
   

    // need to create a method to define schema of the operator
     calculate(operation) {
        const operatorFunction = this.op[operation];       // look up the method

        if (!operatorFunction) {                           // guard: unknown symbol
            console.log("Unknown operator. Use +, -, *, /");
            return this;
        }

        operatorFunction.call(this);                       
        return this;
    }
}



const readline = require("readline")
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function ask(question) {
    return new Promise((resolve) => rl.question(question, resolve));
}
async function main() {
const number = (await ask("enter first number "));
const operations = await ask("What operation do you want to do (+,-,*,/)");
const number2 = await ask("enter second number ");

// const operator = op[operations](number,number2)


const makeCalc =  new Calculator(number, number2).calculate(operations).getResult();
 
  rl.close();
}


main();