import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Page, LayoutSingleColumn } from '../../components';
import TopbarContainer from '../TopbarContainer/TopbarContainer';
import { ensureCurrentUser } from '../../util/data';
import { isScrollingDisabled } from '../../ducks/ui.duck';

import css from './JoinMeetingPage.module.css';

const JoinMeetingPage = ({ currentUser, scrollingDisabled }) => {
  const { transactionId } = useParams();
  const [error, setError] = useState(null);
  const [meetingData, setMeetingData] = useState(null);
  const [showMeeting, setShowMeeting] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3500';

  const fetchOrCreateMeeting = async () => {
    if (!transactionId) {
      setError('Transaction ID is missing.');
      return;
    }

    try {
      const meetingEndpoint = `${API_BASE_URL}/api/zoom/meetings/${transactionId}`;
      const createMeetingEndpoint = `${API_BASE_URL}/api/zoom/create-meeting-for-transaction`;

      const response = await fetch(meetingEndpoint);

      if (response.status === 404) {
        const createResponse = await fetch(createMeetingEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transactionId,
            topic: `Meeting for Transaction ${transactionId}`,
          }),
        });

        if (!createResponse.ok) {
          const errorText = await createResponse.text();
          throw new Error(`Failed to create meeting: ${errorText}`);
        }

        const meeting = await createResponse.json();
        setMeetingData(meeting);
      } else if (response.ok) {
        const meeting = await response.json();
        setMeetingData(meeting);
      } else {
        throw new Error('Failed to fetch meeting details.');
      }
    } catch (err) {
      setError(err.message || 'An unknown error occurred.');
      console.error('Error fetching/creating meeting:', err);
    }
  };

  useEffect(() => {
    fetchOrCreateMeeting();
  }, [transactionId]);

  const handleJoinMeeting = (e) => {
    e.preventDefault();
    setShowMeeting(true);
  };

  return (
    <Page className={classNames(css.root)} title="Join Meeting" scrollingDisabled={scrollingDisabled}>
      <LayoutSingleColumn topbar={<TopbarContainer />}>
        {error ? (
          <div className={css.error}>
            <p>Error: {error}</p>
          </div>
        ) : meetingData ? (
          <div className={css.success}>
            <p>
              Meeting Created!{' '}
              <button onClick={handleJoinMeeting} className={css.joinButton}>
                Join Meeting
              </button>
            </p>
            {showMeeting && (
              <div className={css.meetingContainer}>
                <div className={css.meetingWrapper}>
                  <iframe
                    src={meetingData.join_url || meetingData.joinUrl}
                    allow="microphone; camera; fullscreen"
                    className={css.meetingFrame}
                    title="Zoom Meeting"
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className={css.loading}>
            <p>Fetching/Creating Zoom Meeting...</p>
          </div>
        )}
      </LayoutSingleColumn>
    </Page>
  );
};

const mapStateToProps = (state) => {
  const { currentUser } = state.user;
  return {
    currentUser: ensureCurrentUser(currentUser),
    scrollingDisabled: isScrollingDisabled(state),
  };
};

export default connect(mapStateToProps)(JoinMeetingPage);
