export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

export function validateRegister(body) {
  const errors = [];
  if (!body.firstName?.trim()) errors.push("First name is required");
  if (!body.lastName?.trim()) errors.push("Last name is required");
  if (!body.email?.trim()) errors.push("Email is required");
  else if (!validateEmail(body.email)) errors.push("Invalid email address");
  if (!body.password || body.password.length < 8)
    errors.push("Password must be at least 8 characters");
  return errors;
}

export function validateLogin(body) {
  const errors = [];
  if (!body.email?.trim()) errors.push("Email is required");
  if (!body.password) errors.push("Password is required");
  return errors;
}
