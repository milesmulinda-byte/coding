
// function to be adding two number.
function add(a, b) {
  const logic =  a + b
  const result = logic;
 console.log(a + "+" + b + "=" + result);
}

// function to be substructing two number.
function sub(a, b) {
  const logic = a - b
  const result = logic;
  console.log(a + "-" + b + "=" + result);
}

// function to be multiplying two number.
function mul(a, b) {
  const logic = a * b
  const result = logic
  console.log(a + "*" + b +  "=" + result);
}

// function to be division two number.
function div(a, b) {
  if (b === 0) {
    console.log("The denominator has to be a number differ from zero.");
  } else {
  const logic = a / b
  const result = logic;
  console.log(a + "/" + b + "=" + result);;
  }
}

const op = {
"+":add,
"-":sub,
"/":div,
"*":mul,
}

// Calculator function to do operations between two numbers
function Calculator() {
  // step one: ask for numbers I/O;
  const number = parseInt(prompt("enter first number "));
  const operations = prompt("What operation do you want to do (+,-,*,/)");
  const number2 = parseInt(prompt("enter second number "));

  const operator = op[operations](number,number2)
}


console.log(Calculator());



