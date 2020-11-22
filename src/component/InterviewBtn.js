import React from 'react';
import '.././App.js';
import Button from 'react-bootstrap/Button';
import axios from 'axios';


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
  
 // let timeConvertedHr=()=>{ t=parseInt(parseInt(timeStart) / 60); if(t<10) {return "0"+t} else return t};
 
  return (
    <div>
      <div className='_button'>
        <b>Interview Date :{date}</b>
        <div>
          <b>Start Time: </b> {timeConversion(timeStart,1)} :
          {timeConversion(timeStart,0)} <b>End Time: </b>
          {timeConversion(timeEnd,1)} :{' '}
          {timeConversion(timeEnd,0)}
        </div>
        <b>Candidate Email:</b> {candidate}
        <br />
        <b>Interviewer emails:</b>{' '}
        {interviewer.map((_i) => (
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
