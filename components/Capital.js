// capitalise function
function Capital(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// uncapitalise function
function UnCapital(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

export { Capital, UnCapital };
