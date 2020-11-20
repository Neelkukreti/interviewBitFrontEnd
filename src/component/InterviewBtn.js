import React from 'react';
import '.././App.js';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

function InterviewBtn({
  id,
  date,
  timeStart,
  timeEnd,
  candidate,
  interviewer,
  handleShow,
  setModalData,
  history,
  fetchData,
  candidateName,
  interviewerName,
}) {
  console.log('logging props');
  console.log('time' + timeStart);
  return (
    <div>
      <div className='_button'>
        Interview Date :{date}
        <div>
          <b>Start Time: </b> {parseInt(parseInt(timeStart) / 60)} :
          {parseInt(parseInt(timeStart) % 60)} <b>End Time: </b>
          {parseInt(parseInt(timeEnd) / 60)} :{' '}
          {parseInt(parseInt(timeEnd) % 60)}
        </div>
        Candidate Email: {candidate}
        <br />
        Interviewer emails:{' '}
        {interviewer?.split(',').map((_i) => (
          <p>{_i}</p>
        ))}
        <div>
          <button
            className='btn btn-primary'
            onClick={() => {
              setModalData({
                id,
                date,
                timeStart,
                timeEnd,
                candidate,
                interviewer,
                handleShow,

                candidateName,
                interviewerName,
                setModalData,
              });

              handleShow(id);
            }}
          >
            Edit
          </button>
          <button
            className='btn btn-danger ml-2'
            onClick={async () => {
              let _formData = new FormData();
              _formData.append('id', id);
              await new axios({
                url: 'http://localhost:5000/api/interview/delete',
                data: _formData,
                config: { headers: { 'Content-Type': 'multipart/form-data' } },
                method: 'POST',
              });

              await fetchData();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default InterviewBtn;
