import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';

import { FormattedMessage, injectIntl, intlShape } from '../../../util/reactIntl';
import { Form, FieldTextInput, SecondaryButtonInline } from '../../../components';

import css from './SendMessageForm.module.css';

const BLUR_TIMEOUT_MS = 100;

// Define the IconSendMessage component
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

// This component is responsible for rendering the send message form in the TransactionPanel
class SendMessageFormComponent extends Component {
  constructor(props) {
    super(props);
    console.log('SendMessageForm transactionId:', props.transactionId.uuid); // Logging the correct transaction ID
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleJoinMeeting = this.handleJoinMeeting.bind(this);
    this.blurTimeoutId = null;
  }

  componentWillUnmount() {
    // Clear the blur timeout when the component is about to be unmounted
    window.clearTimeout(this.blurTimeoutId);
  }

  handleFocus() {
    // Call the onFocus prop function when the user focuses on the message input
    this.props.onFocus();
    // Clear the blur timeout, as the user is now focused on the input
    window.clearTimeout(this.blurTimeoutId);
  }

  handleBlur() {
    // Set a timeout to call the onBlur prop function after a short delay
    this.blurTimeoutId = window.setTimeout(() => {
      this.props.onBlur();
    }, BLUR_TIMEOUT_MS);
  }

  handleJoinMeeting() {
    const { transactionId, history } = this.props;
    console.log('SendMessageForm transactionId:', transactionId);
    // Redirect to the join-meeting page with the correct transactionId.uuid
    if (transactionId && transactionId.uuid) {
      history.push(`/join-meeting/${transactionId.uuid}`);
    } else {
      console.error('Invalid transactionId:', transactionId);
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

          // Construct the final className for the root element
          const classes = classNames(rootClassName || css.root, className);
          // Determine if the submit button should be disabled
          const submitDisabled = invalid || inProgress;

          return (
            <Form className={classes} onSubmit={values => handleSubmit(values, form)}>
              {/* Render the message input field */}
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
                {/* Display an error message if there was an issue sending the message */}
                {sendMessageError && (
                  <p className={css.error}>
                    <FormattedMessage id="SendMessageForm.sendFailed" />
                  </p>
                )}
                <div className={css.buttonGroup}>
                  {/* Render the "Join Meeting" button */}
                  <button
                    type="button"
                    className={css.joinMeetingButton}
                    onClick={this.handleJoinMeeting}
                  >
                    <FormattedMessage id="SendMessageForm.joinMeeting" />
                  </button>
                  {/* Render the "Send Message" button */}
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
  transactionId: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
  }).isRequired,
};

// Wrap the SendMessageFormComponent with the necessary higher-order components
const SendMessageForm = compose(
  injectIntl,
  withRouter
)(SendMessageFormComponent);

export default SendMessageForm;
