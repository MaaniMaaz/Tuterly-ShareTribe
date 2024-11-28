import React from 'react';

const JoinMeetingPage = () => {
  const zoomMeetingUrl = 'https://us04web.zoom.us/j/1234567890?pwd=abcdef123456'; // Replace with your meeting link

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <iframe
        src={zoomMeetingUrl}
        title="Zoom Meeting"
        width="100%"
        height="100%"
        frameBorder="0"
        allow="camera; microphone; fullscreen"
        style={{ border: 'none' }}
      ></iframe>
    </div>
  );
};

export default JoinMeetingPage;
