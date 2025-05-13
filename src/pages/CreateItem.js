import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Categories from '../components/Modals/Categories';
import Detail from '../components/Typography/Detail';
import Header from '../components/Typography/Header';
import Title from '../components/Typography/Title';

function CreateItem() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState({});

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        axios.get(`https://localhost:33123/categories/${selectedCategory.id}`)
            .then((res) => setCategories(res.data));
    }, [selectedCategory]);

    const today = new Date();

    const initialValues = {
        name: "",
        description: "",
        currently: "",
        number_of_bids: 0,
        started: today,
        date: today,
        furthermostCategoryId: 0,
    };

    const customTextArea = (props) => (
        <textarea type="text" {...props} />
    );

    const validationSchema = Yup.object().shape({
        name: Yup.string().min(3).max(155).required("You must input a name"),
        description: Yup.string().min(23).max(4000).required("You must input a description"),
        currently: Yup.number("You must input a number.")
            .required("You must input an initial price.")
            .test("maxDigitsAfterDecimal", "This must have 2 digits after decimal or less", (number) =>
                /^\d+(\.\d{1,2})?$/.test(number)
            ),
        buy_price: Yup.number().moreThan(Yup.ref('currently'), "This has to be greater than Starting Price"),
        started: Yup.date().min(today, "Starting time can't be in the past."),
        ends: Yup.date().required("You must input an ending time.").min(
            Yup.ref('started'),
            "Ending time can't be before starting time."
        ),
    });

    const onSubmit = (data) => {
        const now = new Date();
        if (Date.parse(data.started) > Date.parse(now)) {
            data.state = "EXPECTED";
        }

        if (!data.buy_price) {
            data.buy_price = null;
        }

        data.first_bid = data.currently;
        data.furthermostCategoryId = selectedCategory.id;

        const head = {
            headers: {
                accessToken: localStorage.getItem("accessToken")
            }
        };

        axios.post("https://localhost:33123/items", data, head).then((res) => {
            if (res.data.error) {
                alert("You are not signed in!");
            } else {
                navigate(`/`);
            }
        });
    };

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            backgroundImage: `url("https://localhost:33123/images/background.png")`,
            backgroundRepeat: 'repeat',
        }}>
            <div className='createItemPage'>
                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    validationSchema={validationSchema}
                >
                    <Form className='formContainer gradient-custom'>
                        <Title title="Create an Auction" />

                        <label>Title: </label>
                        <ErrorMessage name="name" component="span" />
                        <Field id="inputCreateItem" name="name" placeholder="Item" />

                        <label>Starting Price: </label>
                        <ErrorMessage name="currently" component="span" />
                        <Field id="inputCreateItem" name="currently" placeholder="$$$" />

                        <label>Buying Price: </label>
                        <ErrorMessage name="buy_price" component="span" />
                        <Field id="inputCreateItem" name="buy_price" placeholder="$$$" />

                        <label>Starting Time: </label>
                        <ErrorMessage name="started" component="span" />
                        <Field id="inputCreateItem" name="started" type="datetime-local" />

                        <label>Ending Time: </label>
                        <ErrorMessage name="ends" component="span" />
                        <Field id="inputCreateItem" name="ends" type="datetime-local" />

                        <label>Description: </label>
                        <ErrorMessage name="description" component="span" />
                        <Field
                            id="inputDescription"
                            name="description"
                            as={customTextArea}
                            placeholder="Write a short description here"
                        />

                        <label>Category: </label>
                        <Detail text={categories.map((value, key) => (
                            <div key={key}>{value}{key === categories.length - 1 ? "" : ","}&nbsp;</div>
                        ))} />
                        <Header text={<div style={{ color: 'rgb(76, 76, 76)' }}>
                            <Categories setSelectedCategory={setSelectedCategory} />
                        </div>} />

                        <button type="submit" className='buttonito'>Add Item</button>
                    </Form>
                </Formik>
            </div>
        </div>
    );
}

export default CreateItem;
