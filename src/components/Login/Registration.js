import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    borderRadius: 6,
    boxShadow: 24,
    p: 4,
};

function Registration() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const initialValues = {
        username: "",
        name: "",
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .min(3)
            .max(20)
            .required("You must input a username (Discord ID)")
            .test('Unique Username', 'Username already exists', function (value) {
                return new Promise((resolve) => {
                    axios.get(`https://localhost:33123/auth/exists/${value}`)
                        .then((res) => resolve(!res.data.exists))
                        .catch(() => resolve(true));
                });
            }).matches(/^\d{17,20}$/, "Invalid Discord ID format"),
        name: Yup.string().min(3).max(30).required("You must input a name"),
    });

    const handleClose = () => {
        setOpen(false);
        navigate('/auctions');
    };

    const onSubmit = (data) => {
        axios.post("https://localhost:33123/auth/", data).then(() => {
            setOpen(true);
        });
    };

    return (
        <div className='createItemPage'>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
                validateOnChange={false}
            >
                <Form className='formContainer gradient-custom'>
                    <label>Username: </label>
                    <ErrorMessage name="username" component="span" />
                    <Field
                        id="inputCreateItem"
                        name="username"
                        placeholder="Discord ID"
                    />
                    <label>Name: </label>
                    <ErrorMessage name="name" component="span" />
                    <Field
                        id="inputCreateItem"
                        name="name"
                        placeholder="Name"
                    />
                    <button type="submit">Confirm</button>
                </Form>
            </Formik>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h5" component="h2">
                        Application Received
                    </Typography>
                    <img
                        alt="Received"
                        className='approval_photo'
                        src='https://codenex.in/wp-content/uploads/2019/01/appdevelopment.png'
                    />
                    <Typography variant="h6" id="modal-modal-description" sx={{ mt: 2 }}>
                        You'll be able to use our services as soon as you have been approved!
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
}

export default Registration;
