'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 0.12, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-12-06T23:36:17.929Z',
    '2020-12-07T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 0.15,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');



//Dates:
const getDateDays = (date) => {

  const currentDays = (date1, date2) => Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));
  
  const calcDays = currentDays(new Date(), date)
  console.log(calcDays);
  if(calcDays === 0) return 'Today';
  if(calcDays ===1)return 'Yesterday';
  if(calcDays <= 7) return `${calcDays()} Days ago`;
  const opt = { dateStyle: 'short'};
    return Intl.DateTimeFormat(currentAcc.locale,opt).format(date)

  }

  const formatCurrency = (acc, el) => {
   return new Intl.NumberFormat(acc.locale, {style: 'currency', currency: acc.currency}).format(el)
  }



// Motrar los movimientos de la cuenta
const displayMovements = (acc, sort= false) => {
  
  const moves = sort ? acc.movements.map(e => e).sort((a,b) => a-b) : acc.movements;
  containerMovements.innerHTML = ''
  moves.forEach((el, i) => {
    const dates = new Date(acc.movementsDates[i]);

    

    const elCero = el> 0 ? 'deposit' : 'withdrawal' 

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${elCero}">${i + 1} ${elCero}</div>
          <div class="movements__date">${getDateDays(dates)}</div>
          <div class="movements__value">${formatCurrency(acc, el)}</div>
        </div>
    `
    containerMovements.insertAdjacentHTML('afterbegin',html)
  })
}



const calcUsername = (accs) => {
  accs.forEach(el => {
    el.username = el.owner.toLowerCase().split(' ').map(el => el.slice(0, 1)).join('')
    
  })
}
calcUsername(accounts)


//Clacular valos total de Ingrasos y egresos. 


const calcDisplaySummry = (accs) => {

  accs.balance = accs.movements.reduce((acc, curr) => {
   return acc + curr
  },0);
  return labelBalance.textContent= `${formatCurrency(accs, accs.balance)}`
};


//Sumas los ingresos y egresos.

const calcDisplayBalance = (mov) => {
  const interesR = mov.interestRate;

  const valueIn = mov.movements.filter(mov => mov > 0).reduce((acc, curr) => acc + curr, 0);

  const valueOut = mov.movements.filter(mov => mov < 0).reduce((acc, curr) => acc + curr, 0);

  const interest = mov.movements.filter(mov => mov > 0 && mov * interesR > 1 ).map(mov => mov * interesR).reduce((acc, curr) => acc + curr, 0);
  return  labelSumIn.textContent = `${formatCurrency(mov, valueIn)}`, labelSumOut.textContent = `${formatCurrency(mov, valueOut)}`, labelSumInterest.textContent = `${formatCurrency(mov, interest)}`;
};

// Update USER :

const updateUI = (accs) => {
        // Display Movements;

        displayMovements(accs);

        //Display Balance;
    
        calcDisplayBalance(accs);
    
        //Display Summary:
    
        calcDisplaySummry(accs)
}

  // cerrar cuenta de user:

const closeAcc = (accs, current) => {
    const index = accs.findIndex(e => e === current);
    return accs.splice(index, 1)

  }



//Incorporando el login;

let currentAcc;

const login = btnLogin.addEventListener('click', (e) => {
  e.preventDefault();
  // Seleccinar current User
  currentAcc = accounts.find(acc => acc.username === inputLoginUsername.value);
  if(currentAcc?.pin === Number(inputLoginPin.value)){
    containerApp.classList.add('removeOpa');

    //Display Welcome :

    labelWelcome.textContent = `Welcome back, ${currentAcc.owner.split(' ')[0]}`;
    const now = new Date();
    const opt = { dateStyle: 'full', timeStyle: 'short'};
    const local = navigator.language 
    labelDate.textContent = `${new Intl.DateTimeFormat(currentAcc.locale, opt).format(now)}`
    updateUI(currentAcc)
    
  }
  inputLoginUsername.value = inputLoginPin.value= '';
  inputLoginPin.blur();
});

btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();
  btnTransfer.blur();

  const amount = Number(inputTransferAmount.value);
  const reciverAcc = accounts.find(acc => acc.username === inputTransferTo.value)

  if (amount <= 0 || amount > currentAcc.balance) {
    console.log('Please transfer a valid amount');
  }else{

      currentAcc.movements.push(-Math.abs(amount));
      currentAcc.movementsDates.push(`${new Date().toISOString()}`);

      reciverAcc.movements.push(amount);
      reciverAcc.movementsDates.push(`${new Date().toISOString()}`);

      updateUI(currentAcc)
  }
    inputTransferTo.value = inputTransferAmount.value = ''
})


btnLoan.addEventListener('click', (e) => {
  e.preventDefault();
  const ruleForLoan = currentAcc.movements.some(e => {
  return  e >=  Number(inputLoanAmount.value) * 0.1
  });
  console.log(ruleForLoan);
  if(!ruleForLoan || +inputLoanAmount.value <= 0){
    alert('Sus depositos no cumplen con la condición necesaria para otorgarle el prestamo.');
  }else{
    currentAcc.movementsDates.push(`${new Date().toISOString()}`);
    currentAcc.movements.push(Math.floor(Number(inputLoanAmount.value)));
    updateUI(currentAcc);
    inputLoanAmount.value = '';
  }
})


btnClose.addEventListener('click', (e) => {
  e.preventDefault();
  
  if(currentAcc.username === inputCloseUsername.value && currentAcc.pin === Number(inputClosePin.value)){
    closeAcc(accounts, currentAcc)
    console.log(accounts);
    inputCloseUsername.value = inputClosePin.value =''
    containerApp.classList.remove('removeOpa');
    labelWelcome.textContent = 'Log in to get started'
  };
  
});
let sorted = false
btnSort.addEventListener('click', () => {

   displayMovements(currentAcc.movements, !sorted);

   sorted = !sorted;  
   
})
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
// console.log(parseInt('30px', 10));
// console.log(Math.trunc(Math.random() *6 + 1));

// const minAndMax = (min, max) => {
//   console.log(Math.trunc(Math.random() * (max - min) + 1  ) + min);
// }

// minAndMax(10, 20);

// console.log(Math.round(25.49));
// console.log(+(22.5).toFixed(1));

// const numberImpar= (num) =>{
// return  num % 2 === 0 ? 'Su numero es PAR': 'Su numero es IMPAR'
// };

// console.log(numberImpar(123456789123));
// console.log(777% 2);


// btnLogin.addEventListener('click', (e) => {
//   e.preventDefault();
//   [...document.querySelectorAll('.movements__row')].forEach((e, i) => {
//       if(i % 2 === 0) e.style.backgroundColor= 'gray'
//   })
// })

const future = new Date(2020, 11, 4);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());