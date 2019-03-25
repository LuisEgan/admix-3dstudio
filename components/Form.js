import React from 'react';
import { Mutation, withApollo } from 'react-apollo';
import { Formik, Form } from 'formik';

let AdmixForm = props => {
  const { children, validate, onSubmit, initialValues, mutation, onCompleted, onError } = props;
  return (
    <Mutation mutation={mutation} onCompleted={onCompleted} onError={onError}>
      {(mutation, { error }) => {
        <Formik validate={validate} onSubmit={onSubmit} initialValues={initialValues}>
          {formProps => <Form>{React.cloneElement(children, { ...formProps, mutation })}</Form>}
        </Formik>;
      }}
    </Mutation>
  );
};

AdmixForm = withApollo(AdmixForm);

export default AdmixForm;
