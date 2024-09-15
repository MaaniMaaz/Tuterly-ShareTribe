import React, { useState, useEffect } from 'react';
import { Field } from 'react-final-form';
import { useLocation } from 'react-router-dom/cjs/react-router-dom';
import { bool, string } from 'prop-types';
import classNames from 'classnames';

import { intlShape } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import * as validators from '../../util/validators';
import { FieldSelect } from '../../components';

import css from './AuthenticationPage.module.css';

const FieldSelectUserType = props => {
  const { rootClassName, className, name, userTypes, hasExistingUserType, intl } = props;
  const classes = classNames(rootClassName || css.userTypeSelect, className);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialUserType = queryParams.get('userType') || '';

  // State to store the selected user type
  const [selectedUserType, setSelectedUserType] = useState(initialUserType || '');

  // Handle changes in the user type dropdown
  const handleUserTypeChange = event => {
    setSelectedUserType(event.target.value);
  };

  useEffect(() => {
    // If there's a userType in the URL, set it automatically
    if (initialUserType) {
      setSelectedUserType(initialUserType);
    }
  }, [initialUserType]);

  return (
    <>
      <FieldSelect
        id={name}
        name={name}
        className={classes}
        label={intl.formatMessage({ id: 'FieldSelectUserType.label' })}
        validate={validators.required(intl.formatMessage({ id: 'FieldSelectUserType.required' }))}
        onChange={handleUserTypeChange}
      >
        <option disabled value="">
          {intl.formatMessage({ id: 'FieldSelectUserType.placeholder' })}
        </option>
        {userTypes.map(config => (
          <option key={config.userType} value={config.userType}>
            {config.label}
          </option>
        ))}
      </FieldSelect>

      {/* Dynamically render different fields based on the selected user type */}
      {selectedUserType === 'tutor' && (
        <div>
          <Field
            name="email"
            component="input"
            type="email"
            placeholder="Email"
            className={css.field}
            validate={validators.required(intl.formatMessage({ id: 'Field.email.required' }))}
          />
          <Field
            name="firstName"
            component="input"
            type="text"
            placeholder="First name"
            className={css.field}
            validate={validators.required(intl.formatMessage({ id: 'Field.firstName.required' }))}
          />
          <Field
            name="lastName"
            component="input"
            type="text"
            placeholder="Last name"
            className={css.field}
            validate={validators.required(intl.formatMessage({ id: 'Field.lastName.required' }))}
          />
          {/* Add other Tutor-specific fields */}
        </div>
      )}

      {selectedUserType === 'student' && (
        <div>
          <Field
            name="school"
            component="input"
            type="text"
            placeholder="School Name"
            className={css.field}
            validate={validators.required(intl.formatMessage({ id: 'Field.school.required' }))}
          />
          <Field
            name="gradeLevel"
            component="input"
            type="text"
            placeholder="Grade Level"
            className={css.field}
            validate={validators.required(intl.formatMessage({ id: 'Field.gradeLevel.required' }))}
          />
          {/* Add other Student-specific fields */}
        </div>
      )}
    </>
  );
};

FieldSelectUserType.defaultProps = {
  rootClassName: null,
  className: null,
  hasExistingUserType: false,
};

FieldSelectUserType.propTypes = {
  rootClassName: string,
  className: string,
  name: string.isRequired,
  userTypes: propTypes.userTypes.isRequired,
  hasExistingUserType: bool,
  intl: intlShape.isRequired,
};

export default FieldSelectUserType;
