function generateTrackingNumber() {
  const input = "TRK5775XXXXXDO";
  const randomNumber = () => Math.trunc(Math.random() * 10);
  input.replace(/X/g, randomNumber);
  return input;
}

module.exports = { generateTrackingNumber };
