const d = new Date;
const year = d.getFullYear();
const month = d.getMonth() + 1;
const day = d.getDate();
const birthDate = new Date('06/03/1997');
const birthYear = birthDate.getFullYear();
const birthMonth = birthDate.getMonth();
const birthDay = birthDate.getDate();

let age = year - birthYear;

if (month < birthMonth || month == birthMonth && day < birthDay) {
    age--;
}

console.log(age < 0 ? 0 : age);
