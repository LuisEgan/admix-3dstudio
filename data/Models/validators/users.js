const yup = require('yup');

// validationSchema: Yup.object({
//   password: Yup.string().required('Password is required'),
//   passwordConfirmation: Yup.string()
//     .oneOf([Yup.ref('password'), null], 'Passwords must match')
// });

const emailSchema = yup
  .string()
  .email()
  .lowercase()
  .trim();

const passwordSchema = yup
  .string()
  .min(8, 'at least 8 chars')
  .matches(/[a-z]/, 'at least one lowercase char')
  .matches(/[A-Z]/, 'at least one uppercase char')
  .matches(/[a-zA-Z]+[^a-zA-Z\s]+/, 'at least 1 number or special char (@,!,#, etc).');

// const passwordConfirmSchema = yup.string()
//   .equalTo(yup.ref(passwordSchema), 'passwords dont match');

module.exports = {
  email: {
    validator: password => emailSchema.isValid(password),
    message: props => `${props.value} is not a valid email address!`,
  },
  password: {
    validator: password => passwordSchema.isValid(password),
    // message: props => `${props.value} is not a valid password!`,
    message: props => `Invalid password!`,
  },
};
