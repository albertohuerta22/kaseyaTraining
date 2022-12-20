import React, { useState, useEffect } from 'react';
// import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
// import { Table, Button, Row, Col, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
// import overlayFactory from 'react-bootstrap-table2-overlay';

//imported components
import NewEmployeeForm from '../components/NewEmployeeForm';

//imported actions
import { listEmployees, deleteEmployee } from '../action/employeeAction';

const ListScreen = () => {
  const [deletet, setDeletet] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const employeeList = useSelector((state) => state.employeeList);
  const { loading, error, employees } = employeeList;
  const skillList = useSelector((state) => state.skillList);
  const { skills } = skillList;

  //if not logged in protect middleware will prevent screen
  useEffect(() => {
    dispatch(listEmployees());
  }, [dispatch, listEmployees]);

  const deleteHandler = (id) => {
    // fail safe
    if (window.confirm('Are you sure')) {
      dispatch(deleteEmployee(id));
    }
  };

  const columns = [
    { dataField: '_id', text: 'ID', editable: false },
    { dataField: 'firstName', text: 'First Name' },
    { dataField: 'lastName', text: 'Last Name' },
    { dataField: 'email', text: 'Email' },
    { dataField: 'dob', text: 'DOB' },
    { dataField: 'age', text: 'AGE' },
    { dataField: 'skills', text: 'Skill-ID', editable: false },
    { dataField: 'active', text: 'Active' },
    {
      dataField: 'remove',
      text: 'Delete',
      formatter: (cellContent, row) => {
        return <button onClick={() => deleteHandler(row._id)}>Delete</button>;
      },
    },
  ];

  const cellEdit = cellEditFactory({
    mode: 'dbclick',
  });

  return (
    <>
      <BootstrapTable
        keyField="_id"
        data={employees}
        columns={columns}
        cellEdit={cellEdit}
        striped
        hover
      />
      <NewEmployeeForm />
    </>
  );
};

export default ListScreen;
