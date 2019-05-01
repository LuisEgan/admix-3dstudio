import React from 'react';
import { Mutation, withApollo } from 'react-apollo';
import { Formik, Form } from 'formik';

let AdmixForm = props => {
  const { children, validate, onSubmit, initialValues, mutation, onCompleted, onError } = props;

  const DisplayForm = ({ mutation }) => (
    <Formik
      validate={validate}
      initialValues={initialValues}
      onSubmit={values => onSubmit(values, mutation)}
    >
      {formProps => {
        return (
          <Form>
            {React.Children.map(children, child => {
              if (typeof child.type !== 'function') return child;
              return React.cloneElement(child, { ...formProps, mutation });
            })}
          </Form>
        );
      }}
    </Formik>
  );

  if (!mutation) return <DisplayForm />;

  return (
    <Mutation mutation={mutation} onCompleted={onCompleted} onError={onError}>
      {(mutation, { error }) => {
        return <DisplayForm mutation={mutation} />;
      }}
    </Mutation>
  );
};

AdmixForm = withApollo(AdmixForm);

export default AdmixForm;
