import React, { useState, useEffect } from 'react';
import '.././App.js';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import validator from 'validator';

function CreateInterview({ history }) {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [interviewer, setInterviewer] = useState('');
  const [interviewer1, setInterviewer1] = useState('');
  const [interviewer2, setInterviewer2] = useState('');
  const [candidate, setCandidate] = useState('');
  const [interviewerName, setInterviewerName] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [isError, setError] = useState(false);
  const [errorDialog, setErrorDialog] = useState('');
  const [candidateList, setCandidateList] = useState([]);
  const [interviewerList, setInterviewerList] = useState([]);

  useEffect(() => {
    (async () => {
      let { data: _candidateList } = await axios.get(
        'http://localhost:5000/api/candidate/fetch'
      );
      let { data: _interviewerList } = await axios.get(
        'http://localhost:5000/api/interviewer/fetch'
      );
      setCandidateList(_candidateList);
      setInterviewerList(_interviewerList);
    })();
  }, []);

  const handleSubmit = async () => {
    console.log('Creating interview..');
    try {
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
        console.log(timeSValue);
        formData.append('timeStart', timeSValue);
        formData.append('timeEnd', timeEValue);
        formData.append('date', date);
        formData.append('interviewer',interviewer); 
        formData.append('interviewer',interviewer1);
        formData.append('interviewer',interviewer2);
        formData.append('interviewerName', interviewerName);
        formData.append('candidateName', candidateName);
        formData.append('candidate', candidate);

        // create interviewee
        let _formData = new FormData();
        _formData.append('name', candidateName);
        _formData.append('email', candidate);
        await new axios({
          url: 'http://localhost:5000/api/candidate/create',
          data: _formData,
          config: { headers: { 'Content-Type': 'multipart/form-data' } },
          method: 'POST',
        });
        // create interviewer
        let __formData = new FormData();
        __formData.append('name', interviewerName);
        __formData.append('email', interviewer);
        await new axios({
          url: 'http://localhost:5000/api/interviewer/create',
          data: __formData,
          config: { headers: { 'Content-Type': 'multipart/form-data' } },
          method: 'POST',
        });
        // create interview
        await new axios({
          url: 'http://localhost:5000/api/interview/create',
          data: formData,
          config: { headers: { 'Content-Type': 'multipart/form-data' } },
          method: 'POST',
        });
        history.push('/');
      }
    } catch (e) {
      console.log('create failed');

      setError(true);
      setErrorDialog(e.response.data.msg);
      console.log(e.response.data.msg);

      console.log(e + 'this is err');
    }
  };

  return (
    <div>
      <h2 className='createInterview'>Interviews Scheduled</h2>

      <br />
      <div style={{ width: '40%', margin: '0 auto' }}>
        <select
          onChange={(e) => {
            console.log(e.target.value);
            setCandidate(e.target.value?.split([' '])[2]);
            setCandidateName(e.target.value?.split([' '])[0]);
          }}
          className='custom-select'
        >
          <option selected>Available Candidates</option>
          {candidateList?.map((_candidate) => (
            <option
              key={_candidate._id}
            >{`${_candidate?.name} email: ${_candidate.email}`}</option>
          ))}
        </select>
        <br />
        <br />
        <select
          onChange={(e) => {
            console.log(e.target.value);
            setInterviewer(e.target.value?.split([' '])[2]);
            setInterviewerName(e.target.value?.split([' '])[0]);
          }}
          className='custom-select'
        >
          <option selected>Available Interviewer</option>
          {interviewerList?.map((_interviewer) => (
            <option
              key={_interviewer._id}
            >{`${_interviewer?.name} email: ${_interviewer.email}`}</option>
          ))}
        </select>
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
              className='form-control'
              onChange={(e) => setDate(e.target.value)}
              type='date'
            />
          </div>
          <div className='form-group'>
            <label>Start Time: </label>
            <input
              className='form-control'
              onChange={(e) => setStartTime(e.target.value)}
              type='time'
            />
          </div>
          <div className='form-group'>
            <label>End Time: </label>
            <input
              className='form-control'
              onChange={(e) => setEndTime(e.target.value)}
              type='time'
            />
          </div>
        </form>
      </div>
      {isError && <p style={{ color: 'red' }}>{errorDialog}</p>}

      <div>
        <br />
        <Button onClick={handleSubmit} color='primary'>
          Create Interview
        </Button>
        <br />
        <br />
        <br />
        <br />
      </div>
    </div>
  );
}

export default CreateInterview;
