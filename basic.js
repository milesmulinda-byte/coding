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

// const readline = require('readline');
// const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
// rl.question("What is the width of the rectangle? ", (width) => {
//     rl.question("What is the length of the rectangle? ", (length) => {
//         console.log('The area of the rectangle is: ' + (parseInt(width) * parseInt(length)));
//         rl.close();
//     });
// });

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

let students = [
    // { name: "Alice", age: 20, ID: 101, grade: 85 },
    // { name: "Bob", age: 22, ID: 102, grade: 90 },
    // { name: "Charlie", age: 21, ID: 103, grade: 78 },
    // { name: "David", age: 23, ID: 104, grade: 92 },
    // { name: "Eve", age: 20, ID: 105, grade: 88 },
    // { name: "Frank", age: 22, ID: 106, grade: 80 },
    // { name: "Grace", age: 21, ID: 107, grade: 95 },
    // { name: "Heidi", age: 23, ID: 108, grade: 82 },
    // { name: "Ivan", age: 20, ID: 109, grade: 87 },
    // { name: "Judy", age: 22, ID: 110, grade: 91 }
];

function ask(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

async function main() {
    while (true) {
        console.log("\nAdd Student (1), View Students (2), Search for Student ID (3), Update Student info (4), Delete Student (5), Calculate average (6), Find highest grade (7), Find lowest grade (8), Count total Students (9), Exit (10)");
        const choice = await ask("Choose an option: ");

        if (choice === "1") {
            await AddStudent();
        } else if (choice === "2") {
            await ViewStudents();
        } else if (choice === "3") {
            await SearchStudentID();
        } else if (choice === "4") {
            await UpdateStudentInfo();
        } else if (choice === "5") {
            await DeleteStudent();
        } else if (choice === "6") {
            await CalculateAverage();
        } else if (choice === "7") {
            await FindHighestGrade();
        } else if (choice === "8") {
            await FindLowestGrade();
        } else if (choice === "9") {
            await CountTotalStudents();
        } else if (choice === "10") {
            rl.close();
            break;
        } else {
            console.log("Invalid option. Please enter a number 1-10.");
        }
    }
}

main();

async function AddStudent() {
    const name = await ask("Enter student name: ");
    const age = parseInt(await ask("Enter student age: "));
    const ID = parseInt(await ask("Enter student ID: "));
    const grade = parseInt(await ask("Enter student grade: "));
    students.push({ name, age, ID, grade });
    console.log("Student added successfully.");
}

async function ViewStudents() {
    console.log("List of students:");
    students.forEach(student => {
        console.log(`Name: ${student.name}, Age: ${student.age}, ID: ${student.ID}, Grade: ${student.grade}`);
    });
}

async function SearchStudentID() {
    const ID = parseInt(await ask("Enter student ID to search: "));
    const student = students.find(s => s.ID === ID);
    if (student) {
        console.log(`Name: ${student.name}, Age: ${student.age}, ID: ${student.ID}, Grade: ${student.grade}`);
    } else {
        console.log("Student not found.");
    }
}

async function UpdateStudentInfo() {
    const ID = parseInt(await ask("Enter student ID to update: "));
    const student = students.find(s => s.ID === ID);
    if (student) {
        const name = await ask("Enter new name: ");
        const age = parseInt(await ask("Enter new age: "));
        const grade = parseInt(await ask("Enter new grade: "));
        student.name = name;
        student.age = age;
        student.grade = grade;
        console.log("Student information updated successfully.");
    } else {
        console.log("Student not found.");
    }
}

async function DeleteStudent() {
    const ID = parseInt(await ask("Enter student ID to delete: "));
    const index = students.findIndex(s => s.ID === ID);
    if (index !== -1) {
        students.splice(index, 1);
        console.log("Student deleted successfully.");
    } else {
        console.log("Student not found.");
    }
}

async function CalculateAverage() {
    const total = students.reduce((sum, student) => sum + student.grade, 0);
    const average = total / students.length;
    console.log("Average grade: " + average);
}

async function FindHighestGrade() {
    const highest = Math.max(...students.map(s => s.grade));
    const student = students.find(s => s.grade === highest);
    console.log("Highest grade: " + highest + " by " + student.name);
}

async function FindLowestGrade() {
    const lowest = Math.min(...students.map(s => s.grade));
    const student = students.find(s => s.grade === lowest);
    console.log("Lowest grade: " + lowest + " by " + student.name);
}

async function CountTotalStudents() {
    console.log("Total number of students: " + students.length);
}



