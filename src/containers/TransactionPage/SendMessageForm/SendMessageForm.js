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

// Translation languages available
const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
];

class SendMessageFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTranslating: false,
      selectedLanguage: 'en',
    };

    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleJoinMeeting = this.handleJoinMeeting.bind(this);
    this.handleTranslate = this.handleTranslate.bind(this);
    this.blurTimeoutId = null;
  }

  componentWillUnmount() {
    window.clearTimeout(this.blurTimeoutId);
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

  handleJoinMeeting() {
    const { transactionId, history } = this.props;
    if (transactionId && transactionId.uuid) {
      history.push(`/join-meeting/${transactionId.uuid}`);
    } else {
      console.error('Invalid transactionId:', transactionId);
    }
  }

  async handleTranslate(form) {
    const currentText = form.getFieldState('message')?.value;
    if (!currentText) return;

    this.setState({ isTranslating: true });
    try {
      // Use the correct port from your environment variables
      const response = await fetch(`http://localhost:3500/api/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: currentText,
          targetLanguage: this.state.selectedLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error('Translation request failed');
      }

      const data = await response.json();
      console.log('Translation response:', data); // Add logging
      form.change('message', data.translation);
    } catch (error) {
      console.error('Translation failed:', error);
      this.setState({ translationError: 'Translation failed. Please try again.' });
    } finally {
      this.setState({ isTranslating: false });
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
          const { isTranslating, selectedLanguage } = this.state;

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

              <div className={css.translationControls}>
                <select
                  className={css.languageSelect}
                  value={selectedLanguage}
                  onChange={(e) => this.setState({ selectedLanguage: e.target.value })}
                  disabled={isTranslating}
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>

                <SecondaryButtonInline
                  className={css.translateButton}
                  disabled={isTranslating}
                  onClick={() => this.handleTranslate(form)}
                  type="button"
                >
                  {isTranslating ? (
                    <FormattedMessage id="SendMessageForm.translating" />
                  ) : (
                    <FormattedMessage id="SendMessageForm.translate" />
                  )}
                </SecondaryButtonInline>
              </div>

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
                    <FormattedMessage id="SendMessageForm.joinMeeting" />
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
  transactionId: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
  }).isRequired,
};

const SendMessageForm = compose(
  injectIntl,
  withRouter
)(SendMessageFormComponent);

export default SendMessageForm;
