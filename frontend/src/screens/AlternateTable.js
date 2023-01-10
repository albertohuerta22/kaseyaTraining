import React, { useState, useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Table,
  Button,
  Pagination,
  OverlayTrigger,
  Popover,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
// import overlayFactory from 'react-bootstrap-table2-overlay';

//imported components
import Paginate from '../components/Paginate.js';
import NewEmployeeForm from '../components/NewEmployeeForm.js';
import Message from '../components/Message.js';
import Loader from '../components/Loader.js';
import NewModel from '../components/NewModel.js';
import useWindowDimensions from '../components/FindWindow.js';
import {
  OverlayPopEmail,
  OverlayPopId,
  OverlayPopDOB,
  OverlayPopSkillId,
  OverlayPopActive,
  OverlayPopFirstName,
  OverlayPopLastName,
} from '../components/OverlayPop.js';

//imported actions
import { listEmployees, deleteEmployee } from '../action/employeeAction.js';
import { listSkills } from '../action/skillsAction.js';

const AlternateTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { width, height } = useWindowDimensions();

  const [show, setShow] = useState(false);

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(5);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleClose = () => setShow(false); //handles modal
  const handleShow = () => setShow(true);

  const employeeList = useSelector((state) => state.employeeList);
  const { loading, error, employees } = employeeList;

  const skillList = useSelector((state) => state.skillList);
  const { skills } = skillList;
  //   console.log(skills);

  //if not logged in protect middleware will prevent screen
  useEffect(() => {
    // dispatch(listSkills());
    dispatch(listEmployees());
  }, [dispatch, listEmployees]);

  useEffect(() => {
    dispatch(listSkills());
  }, [dispatch, listSkills]);

  //get current employees
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = employees
    ? employees.slice(indexOfFirstPost, indexOfLastPost)
    : [];
  // console.log(employees);

  const deleteHandler = (id) => {
    // fail safe
    if (window.confirm('Are you sure')) {
      dispatch(deleteEmployee(id));
      navigate('/');
    }
  };
  const editHandler = (employee) => {
    navigate(`/list/${employee.id}`, { state: employee });
  };

  const listScreen = (id) => {
    console.log('');
    // navigate = ()
  };

  return (
    <>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>FIRST</th>
            <th>LAST</th>
            <th>EMAIL</th>
            <th>DOB</th>
            <th>AGE</th>
            <th>SKILL ID</th>
            <th>SKILL Name</th>
            <th>DESCRIPTION</th>
            <th>ACTIVE</th>
          </tr>
        </thead>
        <tbody>
          {employees &&
            currentPosts.map((
              employee // employees > currentPosts
            ) => (
              <tr key={employee._id}>
                <td onClick={() => listScreen}>
                  <OverlayPopId id={employee._id}></OverlayPopId>
                </td>
                <td>
                  {width < 1000 ? (
                    <OverlayPopFirstName firstName={employee.firstName} />
                  ) : (
                    employee.firstName
                  )}
                </td>
                <td>
                  {width < 1000 ? (
                    <OverlayPopLastName lastName={employee.lastName} />
                  ) : (
                    employee.lastName
                  )}
                </td>
                <td>
                  {width < 1500 ? (
                    // <i className="bi bi-envelope"></i>
                    <OverlayPopEmail email={employee.email}></OverlayPopEmail>
                  ) : (
                    employee.email
                  )}
                </td>
                <td>
                  <OverlayPopDOB dob={employee.dob}></OverlayPopDOB>
                </td>
                <td>{employee.age}</td>

                <td>
                  {skills.map((skill) => {
                    for (let key in skill) {
                      if (employee._id === skill[key]) {
                        return (
                          <OverlayPopSkillId
                            key={skill._id}
                            skillID={skill._id}
                          ></OverlayPopSkillId>
                        );
                      }
                    }
                    return null;
                  })}
                </td>
                <td>
                  {skills.map((skill) => {
                    for (let key in skill) {
                      if (employee._id === skill[key]) {
                        return skill.name;
                      }
                    }
                    return null;
                  })}
                </td>
                <td>
                  {skills.map((skill) => {
                    // console.log(skill, employee);
                    if (skill.employee === employee._id) {
                      return skill.description;
                    }
                    return null;
                  })}
                </td>

                <td>
                  <OverlayPopActive
                    active={employee.active.toString()}
                  ></OverlayPopActive>
                </td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() =>
                      editHandler({
                        id: employee._id,
                        email: employee.email,
                        firstName: employee.firstName,
                        lastName: employee.lastName,
                        age: employee.age,
                        active: employee.active,
                        dob: employee.dob,
                      })
                    }
                  >
                    {/* //download bootstrap for trash icon */}
                    {width < 1600 ? (
                      <i className="bi bi-pencil-square"></i>
                    ) : (
                      'Edit'
                    )}
                  </Button>
                  {/* </LinkContainer> */}
                </td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => deleteHandler(employee._id)}
                  >
                    {width < 1600 ? (
                      <i className="bi bi-trash3-fill"></i>
                    ) : (
                      'Delete'
                    )}
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <>
        <Button
          variant="success"
          onClick={handleShow}
          style={{ float: 'right', marginRight: '20px' }}
        >
          + New Employee
        </Button>
        <Modal
          show={show}
          onHide={handleClose}
          keyboard={false}
          backdrop="static"
          dialogClassName={'primaryModal'}
          size="lg"
          className="modal custom fade"
          role="dialog"
        >
          <Modal.Header closeButton>
            <Modal.Title>New Employee</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <NewEmployeeForm />
          </Modal.Body>
        </Modal>
      </>

      <div className="pagination">
        <Paginate
          postsPerPage={postsPerPage}
          totalPosts={employees ? employees.length : 0}
          paginate={paginate}
        />
      </div>
    </>
  );
};

export default AlternateTable;
