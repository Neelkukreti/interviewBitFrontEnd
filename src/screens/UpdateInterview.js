import React, { useState } from 'react';
import '.././App.js';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import validator from 'validator';




function UpdateInterview({
  handleClose,
  fetchData,
  modalData: {
    timeStart,
    timeEnd,
    date: _date,
    candidate: _candidate,
    interviewer: _interviewer,
    id,
    candidateName: _candidateName,
    interviewerName: _interviewerName,
  },
}) {
  function timeConversion(timeStart,f)
{
  if(f==1)
 { let t;
  let t2;
  t=(parseInt(parseInt(timeStart) / 60));
  if(t<10) 
  {t2= "0"+t;} 
  else 
  t2=t;
  return t2;
 }
 else
 {
  let t;
  let t2;
  t=(parseInt(parseInt(timeStart) % 60));
  if(t<10) 
  {t2= "0"+t;} 
  else 
  t2=t;
  return t2;
 }

}
  const [date, setDate] = useState(_date);
  const [startTime, setStartTime] = useState(timeConversion(timeStart,1)+":"+timeConversion(timeStart,0));//(parseInt(parseInt(timeStart)/60))+":"+(parseInt(parseInt(timeStart)%60)));
  const [endTime, setEndTime] = useState(timeConversion(timeEnd,1)+":"+timeConversion(timeEnd,0));//useState(timeEnd);
  const [interviewer, setInterviewer] = useState(_interviewer[0]);
  const [candidate, setCandidate] = useState(_candidate);
  const [interviewer1, setInterviewer1] = useState(
    _interviewer[1] || ''
  );
  const [interviewer2, setInterviewer2] = useState(
    _interviewer[2] || ''
  );
  const [isError, setError] = useState(false);
  const [errorDialog, setErrorDialog] = useState('');
  const [interviewerName, setInterviewerName] = useState(
    _interviewerName || ''
  );
  const [candidateName, setCandidateName] = useState(_candidateName || '');

  const handleSubmit = async () => {
    try {
     // errorDialog="OKERROR";
      let formData = new FormData();
      //time conversion
      const timeS = startTime.split(':');
      const timeSValue = Number(timeS[0]) * 60 + Number(timeS[1]);
      const timeE = endTime.split(':');
      const timeEValue = Number(timeE[0]) * 60 + Number(timeE[1]);

      //date conversion
      const currentTime = new Date().toLocaleTimeString().split(':');
      const timePeriod = currentTime[2].split(' ');
      var curHr = Number(currentTime[0]);
      var curMin = Number(currentTime[1]);
      if (timePeriod[1] === 'PM') {
        curHr = curHr + 12;
      }
      const timeCValue = Number(curHr) * 60 + Number(curMin);
      const dateVal = date.split('-');
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      let _err = false;

      //validations
      if (!validator.isEmail(candidate)) {
        // console.log("Candidate Email not valid");
        _err = true;
        setError(_err);
        setErrorDialog('Candidate Email not valid');
        console.log(errorDialog);
      } else if (!validator.isEmail(interviewer)) {
        console.log('Interviewer Email not valid');
        _err = true;
        setError(_err);
        setErrorDialog('Interviewer Email not valid');
        console.log(errorDialog);
      } else if (
        !validator.isEmail(interviewer1) &&
        !validator.isEmpty(interviewer1)
      ) {
        console.log('Interviewer Email not valid');
        _err = true;
        setError(_err);
        setErrorDialog('Interviewer 2 Email not valid');
        console.log(errorDialog);
      } else if (
        !validator.isEmail(interviewer2) &&
        !validator.isEmpty(interviewer2)
      ) {
        console.log('Interviewer Email not valid');
        _err = true;
        setError(_err);
        setErrorDialog('Interviewer 3 Email not valid');
        console.log(errorDialog);
      } else if (startTime == '') {
        _err = true;
        setError(_err);
        setErrorDialog('Please specify start time');
        console.log(errorDialog);
      } else if (endTime == '') {
        _err = true;
        setError(_err);
        setErrorDialog('Please specify end time');
        console.log(errorDialog);
      } else if (date == '') {
        _err = true;
        setError(_err);
        setErrorDialog('Please specify date');
        console.log(errorDialog);
      } else if (timeSValue >= timeEValue) {
        console.log(
          timeSValue + 'End time cannot be less than start time' + timeEValue
        );
        _err = true;
        setError(_err);
        setErrorDialog('End time cannot be less than start time');
        console.log(errorDialog);
      } else if (dateVal[0] < yyyy) {
        console.log('Year cannot be less than the current year');
        _err = true;
        setError(_err);
        setErrorDialog('Year cannot be less than the current year');
        console.log(errorDialog);
      } else if (dateVal[0] == yyyy) {
        console.log(dateVal[0]);
        if (dateVal[1] < mm) {
          console.log('Cannot Schedule in past months');

          _err = true;
          setError(_err);
          setErrorDialog('Cannot Schedule in past months');
          console.log(errorDialog);
        } else if (dateVal[1] === mm) {
          console.log('MM');
          if (dateVal[2] < dd) {
            console.log('Cannot Schedule in past days');
            _err = true;
            setError(_err);
            setErrorDialog('Cannot Schedule in past days');
            console.log(errorDialog);
          } else if (dateVal[2] === dd) {
            console.log('DD');
            if (timeCValue >= timeSValue) {
              console.log('Cannot Schedule in past time');
              _err = true;
              setError(_err);
              setErrorDialog('Cannot Schedule in past times');
              console.log(errorDialog);
            }
          }
        }
      }
      if (_err) {
        console.log('Exiting');
      } else {
        
        formData.append('timeStart', timeSValue);
        formData.append('timeEnd', timeEValue);
        formData.append('date', date);
        formData.append('interviewer',interviewer); 
        formData.append('interviewer',interviewer1);
        formData.append('interviewer',interviewer2);
        formData.append('candidate', candidate);
        formData.append('interviewerName', interviewerName);
        formData.append('candidateName', candidateName);
        formData.append('id', id);

        await new axios({
          url: 'http://localhost:5000/api/interview/update',
          data: formData,
          config: { headers: { 'Content-Type': 'multipart/form-data' } },
          method: 'POST',
        });
        fetchData();
        handleClose();
      }
    } catch (e) {
      console.log('create failed');

      setError(true);
      setErrorDialog(e.response?.data?.msg);
      console.log(e.response?.data?.msg);

      console.log(e + 'this is err');
    }
  };

  return (
    <div>
      <h2 className='createInterview'>Update Interview</h2>
      <br />
      <div style={{ width: '40%', margin: '0 auto' }}>
        <form>
          <div className='form-group'>
            <label>Candidate Email</label>
            <input
              type='text'
              className='form-control'
              value={candidate}
              onChange={(e) => setCandidate(e.target.value)}
              placeholder='Candidate email'
            />
          </div>
          <div className='form-group'>
            <label>Candidate Name</label>
            <input
              type='text'
              className='form-control'
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder='Candidate Name'
            />
          </div>
          <div className='form-group'>
            <label>Interviewer Email</label>
            <input
              type='text'
              className='form-control'
              value={interviewer}
              onChange={(e) => setInterviewer(e.target.value)}
              placeholder='Interviewer email'
            />
          </div>
          <div className='form-group'>
            <label>Interviewer Name</label>
            <input
              type='text'
              className='form-control'
              value={interviewerName}
              onChange={(e) => setInterviewerName(e.target.value)}
              placeholder='Interviewer name'
            />
          </div>
          <div className='form-group'>
            <label>Interviewer 2</label>
            <input
              type='text'
              className='form-control'
              value={interviewer1}
              onChange={(e) => setInterviewer1(e.target.value)}
              placeholder='Interviewer email (optional)'
            />
          </div>
          <div className='form-group'>
            <label>Interviewer 3</label>
            <input
              type='text'
              className='form-control'
              value={interviewer2}
              onChange={(e) => setInterviewer2(e.target.value)}
              placeholder='Interviewer email (optional)'
            />
          </div>
          <div className='form-group'>
            <label>Date: </label>
            <input
            defaultValue={date}
              className='form-control'
              onChange={(e) => setDate(e.target.value)}
              type='date'
            />
          </div>
          <div className='form-group'>
            <label>Start Time:</label>
            <input
            defaultValue={startTime}
              
              className='form-control'
              onChange={(e) => setStartTime(e.target.value)}
              type='time'
            />
          </div>
          <div className='form-group'>
            <label>End Time: </label>
            <input
            defaultValue={endTime}
              className='form-control'
              onChange={(e) => setEndTime(e.target.value)}
              type='time'
            />
          </div>
        </form>
      </div>
      {isError && (
        <p style={{ color: 'red', textAlign: 'center' }}>{errorDialog}</p>
      )}

      <div>
        <br />
        <button
          className='btn btn-primary'
          style={{ marginLeft: '35%' }}
          onClick={handleSubmit}
          color='primary'
        >
          Update Interview
        </button>
        <br />
        <br />
        <br />
        <br />
      </div>
    </div>
  );
}

export default UpdateInterview;
