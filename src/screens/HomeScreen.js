import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '.././App.js';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import InterviewBtn from '../component/InterviewBtn.js';
import UpdateInterview from './UpdateInterview';

function HomeScreen() {
  const [interviewList, setInterviewList] = useState([]);
  const [modalData, setModalData] = useState({});
  const fetchData = async () => {
    console.log('fetching..');
    let { data } = await axios.get('http://localhost:5000/api/interview/fetch');
    setInterviewList(data);
    console.log('data' + data);
  };
  useEffect(() => {
    // fetch all int
    (async () => {
      await fetchData();
    })();
  }, []);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (id) => {
    console.log(id);
    setShow(true);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <UpdateInterview
          fetchData={fetchData}
          handleClose={handleClose}
          modalData={modalData}
        />
      </Modal>
      <div>
        <div>
          <br />
          <Link to='/create-interview'>
            <Button color='primary'>Create Interview</Button>
          </Link>{' '}
          <br />
        </div>
        <p></p>
        <h2 className='createInterview'>Interviews Scheduled</h2>
        <br />
        {interviewList?.map(
          ({
            _id,
            timeStart,
            timeEnd,
            candidate,
            date,
            interviewer,
            candidateName,
            interviewerName,
          }) => (
            <InterviewBtn
              fetchData={fetchData}
              key={_id}
              id={_id}
              date={date}
              timeStart={timeStart}
              timeEnd={timeEnd}
              candidate={candidate}
              interviewer={interviewer}
              handleShow={handleShow}
              setModalData={setModalData}
              candidateName={candidateName}
              interviewerName={interviewerName}
            />
          )
        )}
        <h3>End</h3>
      </div>
    </>
  );
}

export default HomeScreen;
