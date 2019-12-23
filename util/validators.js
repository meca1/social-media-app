const isEmail = email => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return email.match(regEx) ? true : false;
};

const isEmpty = string => {
  return string.trim() === '' ? true : false;
};

exports.validateSignUpData = data => {
  let errors = {};

  isEmpty(data.email)
    ? (errors.email = 'Email must not be empty')
    : !isEmail(data.email)
    ? (errors.email = 'Must be a valid email address')
    : '';

  if (isEmpty(data.password)) errors.password = 'Password must not be empty';
  if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords must match';
  if (isEmpty(data.handle)) errors.handle = 'Handle must not be empty';
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.validateLoginData = data => {
  let errors = {};

  if (isEmpty(user.email)) errors.email = 'Must not be empty';
  if (isEmpty(user.password)) errors.password = 'Must not be empty';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};
