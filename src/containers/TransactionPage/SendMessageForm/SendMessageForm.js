import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import classNames from 'classnames';

import { FormattedMessage, injectIntl, intlShape } from '../../../util/reactIntl';
import { Form, FieldTextInput, SecondaryButtonInline } from '../../../components';
import { withRouter } from 'react-router-dom';

import css from './SendMessageForm.module.css';

const BLUR_TIMEOUT_MS = 100;

const IconSendMessage = () => (
  <svg
    className={css.sendIcon}
    width="14"
    height="14"
    viewBox="0 0 14 14"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g className={css.strokeMatter} fill="none" fillRule="evenodd" strokeLinejoin="round">
      <path d="M12.91 1L0 7.003l5.052 2.212z" />
      <path d="M10.75 11.686L5.042 9.222l7.928-8.198z" />
      <path d="M5.417 8.583v4.695l2.273-2.852" />
    </g>
  </svg>
);

class SendMessageFormComponent extends Component {
  constructor(props) {
    super(props);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.blurTimeoutId = null;
  }

  handleFocus() {
    this.props.onFocus();
    window.clearTimeout(this.blurTimeoutId);
  }

  handleBlur() {
    this.blurTimeoutId = window.setTimeout(() => {
      this.props.onBlur();
    }, BLUR_TIMEOUT_MS);
  }

  handleJoinMeeting = () => {
    this.props.history.push('/join-meeting');
  };

  componentWillUnmount() {
    if (this.blurTimeoutId) {
      window.clearTimeout(this.blurTimeoutId);
    }
  }

  render() {
    return (
      <FinalForm
        {...this.props}
        render={formRenderProps => {
          const {
            rootClassName,
            className,
            messagePlaceholder,
            handleSubmit,
            inProgress,
            sendMessageError,
            invalid,
            form,
            formId,
          } = formRenderProps;

          const classes = classNames(rootClassName || css.root, className);
          const submitDisabled = invalid || inProgress;

          return (
            <Form className={classes} onSubmit={values => handleSubmit(values, form)}>
              <FieldTextInput
                inputRootClass={css.textarea}
                type="textarea"
                id={formId ? `${formId}.message` : 'message'}
                name="message"
                placeholder={messagePlaceholder}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
              />
              <div className={css.submitContainer}>
                {sendMessageError && (
                  <p className={css.error}>
                    <FormattedMessage id="SendMessageForm.sendFailed" />
                  </p>
                )}
                <div className={css.buttonGroup}>
                  <button
                    type="button"
                    className={css.joinMeetingButton}
                    onClick={this.handleJoinMeeting}
                  >
                    <FormattedMessage id="SendMessageForm.joinMeeting" defaultMessage="Join Meeting" />
                  </button>
                  <SecondaryButtonInline
                    className={css.submitButton}
                    inProgress={inProgress}
                    disabled={submitDisabled}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                  >
                    <IconSendMessage />
                    <FormattedMessage id="SendMessageForm.sendMessage" />
                  </SecondaryButtonInline>
                </div>
              </div>
            </Form>
          );
        }}
      />
    );
  }
}

SendMessageFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  inProgress: false,
  messagePlaceholder: null,
  onFocus: () => null,
  onBlur: () => null,
  sendMessageError: null,
};

SendMessageFormComponent.propTypes = {
  rootClassName: PropTypes.string,
  className: PropTypes.string,
  inProgress: PropTypes.bool,
  messagePlaceholder: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  sendMessageError: PropTypes.string,
  intl: intlShape.isRequired,
  history: PropTypes.object.isRequired,
};

const SendMessageForm = compose(
  injectIntl,
  withRouter
)(SendMessageFormComponent);

export default SendMessageForm;
