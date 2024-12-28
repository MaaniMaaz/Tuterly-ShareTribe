import React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from '../../../util/reactIntl';
import { Heading } from '../../../components';
import MessageTranslator from '../../../components/MessageTranslator/MessageTranslator';

import css from './TransactionPanel.module.css';

// Helper function to process feed content and wrap messages with translator
const processFeedContent = (activityFeed) => {
  return React.Children.map(activityFeed, child => {
    // Check if the child is a message component
    if (child?.props?.messages) {
      // Clone the element and wrap its messages with MessageTranslator
      return React.cloneElement(child, {
        children: child.props.messages.map(message => (
          <MessageTranslator
            key={message.id?.uuid || message.id}
            message={message}
          />
        ))
      });
    }
    // Return unmodified child if it's not a message component
    return child;
  });
};

// Functional component as a helper to build ActivityFeed section
const FeedSection = props => {
  const {
    className,
    rootClassName,
    activityFeed,
    hasTransitions,
    fetchMessagesError,
    initialMessageFailed,
    hasMessages,
    isConversation,
  } = props;

  const showFeed = hasMessages || hasTransitions || initialMessageFailed || fetchMessagesError;
  const classes = classNames(rootClassName || css.feedContainer, className);

  // Process the activity feed to add translation capabilities
  const processedFeed = processFeedContent(activityFeed);

  return showFeed ? (
    <div className={classes}>
      <Heading as="h3" rootClassName={css.sectionHeading}>
        {isConversation ? (
          <FormattedMessage id="TransactionPanel.conversationHeading" />
        ) : (
          <FormattedMessage id="TransactionPanel.activityHeading" />
        )}
      </Heading>
      {initialMessageFailed ? (
        <p className={css.messageError}>
          <FormattedMessage id="TransactionPanel.initialMessageFailed" />
        </p>
      ) : null}
      {fetchMessagesError ? (
        <p className={css.messageError}>
          <FormattedMessage id="TransactionPanel.messageLoadingFailed" />
        </p>
      ) : null}
      <div className={css.feedContent}>{processedFeed}</div>
    </div>
  ) : null;
};

export default FeedSection;
