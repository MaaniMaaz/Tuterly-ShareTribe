import React, { useEffect, useState } from 'react';
import { bool, node, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import classNames from 'classnames';
import { useLocation } from 'react-router-dom';

import { FormattedMessage, injectIntl, intlShape } from '../../../util/reactIntl';
import { propTypes } from '../../../util/types';
import * as validators from '../../../util/validators';
import { getPropsForCustomUserFieldInputs } from '../../../util/userHelpers';

import { Form, PrimaryButton, FieldTextInput, CustomExtendedDataField } from '../../../components';

import FieldSelectUserType from '../FieldSelectUserType';
import UserFieldDisplayName from '../UserFieldDisplayName';
import UserFieldPhoneNumber from '../UserFieldPhoneNumber';

import css from './SignupForm.module.css';

const SignupFormComponent = props => {
  const location = useLocation(); // Get location from react-router-dom
  const [userType, setUserType] = useState(''); // Use state to handle userType

  useEffect(() => {
    // Parse query parameters to get userType
    const params = new URLSearchParams(location.search);
    const userTypeFromUrl = params.get('userType'); // Get userType from URL query params

    // Set userType based on query parameter or fallback to default
    setUserType(userTypeFromUrl || props.preselectedUserType || '');

  }, [location.search, props.preselectedUserType]);

  return (
    <FinalForm
      {...props}
      mutators={{ ...arrayMutators }}
      initialValues={{ userType }}
      render={formRenderProps => {
        const {
          rootClassName,
          className,
          formId,
          handleSubmit,
          inProgress,
          invalid,
          intl,
          termsAndConditions,
          userTypes,
          userFields,
          values,
        } = formRenderProps;

        const { userType } = values || {};

        // Validators for email and password
        const emailRequired = validators.required(
          intl.formatMessage({
            id: 'SignupForm.emailRequired',
          })
        );
        const emailValid = validators.emailFormatValid(
          intl.formatMessage({
            id: 'SignupForm.emailInvalid',
          })
        );

        const passwordRequiredMessage = intl.formatMessage({
          id: 'SignupForm.passwordRequired',
        });
        const passwordMinLengthMessage = intl.formatMessage(
          {
            id: 'SignupForm.passwordTooShort',
          },
          {
            minLength: validators.PASSWORD_MIN_LENGTH,
          }
        );
        const passwordMaxLengthMessage = intl.formatMessage(
          {
            id: 'SignupForm.passwordTooLong',
          },
          {
            maxLength: validators.PASSWORD_MAX_LENGTH,
          }
        );
        const passwordMinLength = validators.minLength(
          passwordMinLengthMessage,
          validators.PASSWORD_MIN_LENGTH
        );
        const passwordMaxLength = validators.maxLength(
          passwordMaxLengthMessage,
          validators.PASSWORD_MAX_LENGTH
        );
        const passwordRequired = validators.requiredStringNoTrim(passwordRequiredMessage);
        const passwordValidators = validators.composeValidators(
          passwordRequired,
          passwordMinLength,
          passwordMaxLength
        );

        // Custom user fields based on the user type
        const userFieldProps = getPropsForCustomUserFieldInputs(userFields, intl, userType);

        const noUserTypes = !userType && !(userTypes?.length > 0);
        const userTypeConfig = userTypes.find(config => config.userType === userType);
        const showDefaultUserFields = userType || noUserTypes;
        const showCustomUserFields = (userType || noUserTypes) && userFieldProps?.length > 0;

        const classes = classNames(rootClassName || css.root, className);
        const submitInProgress = inProgress;
        const submitDisabled = invalid || submitInProgress;

        return (
          <Form className={classes} onSubmit={handleSubmit}>
            {/* Add dynamic H3 title */}
            {userType && (
              <h3 className={css.userTypeTitle}>Sign up as {userType}</h3>
            )}

            <FieldSelectUserType
              name="userType"
              userTypes={userTypes}
              hasExistingUserType={!!userType}
              intl={intl}
              defaultValue={userType} // Set the default value
            />

            {showDefaultUserFields ? (
              <div className={css.defaultUserFields}>
                <FieldTextInput
                  type="email"
                  id={formId ? `${formId}.email` : 'email'}
                  name="email"
                  autoComplete="email"
                  label={intl.formatMessage({
                    id: 'SignupForm.emailLabel',
                  })}
                  placeholder={intl.formatMessage({
                    id: 'SignupForm.emailPlaceholder',
                  })}
                  validate={validators.composeValidators(emailRequired, emailValid)}
                />
                <div className={css.name}>
                  <FieldTextInput
                    className={css.firstNameRoot}
                    type="text"
                    id={formId ? `${formId}.fname` : 'fname'}
                    name="fname"
                    autoComplete="given-name"
                    label={intl.formatMessage({
                      id: 'SignupForm.firstNameLabel',
                    })}
                    placeholder={intl.formatMessage({
                      id: 'SignupForm.firstNamePlaceholder',
                    })}
                    validate={validators.required(
                      intl.formatMessage({
                        id: 'SignupForm.firstNameRequired',
                      })
                    )}
                  />
                  <FieldTextInput
                    className={css.lastNameRoot}
                    type="text"
                    id={formId ? `${formId}.lname` : 'lname'}
                    name="lname"
                    autoComplete="family-name"
                    label={intl.formatMessage({
                      id: 'SignupForm.lastNameLabel',
                    })}
                    placeholder={intl.formatMessage({
                      id: 'SignupForm.lastNamePlaceholder',
                    })}
                    validate={validators.required(
                      intl.formatMessage({
                        id: 'SignupForm.lastNameRequired',
                      })
                    )}
                  />
                </div>

                <UserFieldDisplayName
                  formName="SignupForm"
                  className={css.row}
                  userTypeConfig={userTypeConfig}
                  intl={intl}
                />

                <FieldTextInput
                  className={css.password}
                  type="password"
                  id={formId ? `${formId}.password` : 'password'}
                  name="password"
                  autoComplete="new-password"
                  label={intl.formatMessage({
                    id: 'SignupForm.passwordLabel',
                  })}
                  placeholder={intl.formatMessage({
                    id: 'SignupForm.passwordPlaceholder',
                  })}
                  validate={passwordValidators}
                />

                <UserFieldPhoneNumber
                  formName="SignupForm"
                  className={css.row}
                  userTypeConfig={userTypeConfig}
                  intl={intl}
                />
              </div>
            ) : null}

            {showCustomUserFields ? (
              <div className={css.customFields}>
                {userFieldProps.map(fieldProps => (
                  <CustomExtendedDataField {...fieldProps} formId={formId} />
                ))}
              </div>
            ) : null}

            <div className={css.bottomWrapper}>
              {termsAndConditions}
              <PrimaryButton type="submit" inProgress={submitInProgress} disabled={submitDisabled}>
                <FormattedMessage id="SignupForm.signUp" />
              </PrimaryButton>
            </div>
          </Form>
        );
      }}
    />
  );
};

SignupFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  formId: null,
  inProgress: false,
  preselectedUserType: null,
};

SignupFormComponent.propTypes = {
  rootClassName: string,
  className: string,
  formId: string,
  inProgress: bool,
  termsAndConditions: node.isRequired,
  preselectedUserType: string,
  userTypes: propTypes.userTypes.isRequired,
  userFields: propTypes.listingFields.isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

const SignupForm = compose(injectIntl)(SignupFormComponent);
SignupForm.displayName = 'SignupForm';

export default SignupForm;
