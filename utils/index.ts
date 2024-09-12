export function generatePin() {
  const characters = '0123456789';
  let pin = '';
  for (let i = 0; i < 6; i++) {
    pin += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return pin;
}

console.log(generatePin());
