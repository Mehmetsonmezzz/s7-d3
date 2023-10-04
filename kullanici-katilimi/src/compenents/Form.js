import axios from "axios";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import "./Form.css";

function Form(props) {
  const formElement = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    terms: false,
  };
  const [formData, setFormData] = useState(formElement);
  const [isDisabled, setIsDisabled] = useState(true);
  const [formError, setFormError] = useState({});

  useEffect(() => {
    kontrolFonksiyonu(formData);
  }, [formData]);

  const kontrolFonksiyonuAlanlar = (name, value) => {
    Yup.reach(schema, name)
      .validate(value)
      .then((valid) => {
        const newErrorState = {
          ...formError,
          // computed property name
          // dynamic object keys
          [name]: "",
        };
        setFormError(newErrorState);
      })
      .catch(function (err) {
        const errorMessages = err.errors;
        console.log("error: ", err.name, errorMessages[0]);

        const newErrorState = {
          ...formError,
          [name]: err.errors[0],
        };
        setFormError(newErrorState);
      });
  };

  const kontrolFonksiyonu = (formVerileri) => {
    schema.isValid(formVerileri).then(function (valid) {
      console.log(valid, "valid");
      if (valid === true) {
        console.log("Axios ile sunucuya gönderilebilir buton aktif edilebilir");
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
    });
  };

  let schema = Yup.object().shape({
    first_name: Yup.string().required().min(3, "uzum isim yaz"),
    last_name: Yup.string().required("aferin"),
    password: Yup.string().required("doğru gir"),
    email: Yup.string().email().required("email lazım"),
    terms: Yup.boolean().oneOf([true]),
  });

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    let newValue = type === "checkbox" ? checked : value;
    const newState = {
      ...formData,
      [name]: newValue,
    };
    setFormData(newState);
    kontrolFonksiyonuAlanlar(name, newValue);
  }

  const submitHandler = (event) => {
    event.preventDefault();
    console.log("submitted", event);
    if (isDisabled === false) {
      axios
        .post("https://reqres.in/api/users", formData)
        .then(function (response) {
          console.log(response, "response");
          props.addUser(response.data);
        })
        .catch(function (error) {
          console.log(error, "error");
          alert("Gönderilemedi");
        });
    }
  };
  return (
    <form onSubmit={submitHandler}>
      <div>
        <label htmlFor="first_name">Name</label>
        <input
          id="first_name"
          name="first_name"
          type="text"
          placeholder="Adınız"
          value={formData.first_name}
          onChange={handleChange}
        />
        {formError.first_name && (
          <p className="error">{formError.first_name}</p>
        )}
      </div>
      <div>
        <label htmlFor="last_name">Surname</label>
        <input
          id="last_name"
          name="last_name"
          type="text"
          placeholder="Soyadınız"
          value={formData.last_name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email adresiniz"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="password">Şifre</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Şifreniz"
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="password">checkbox</label>
        <input
          id="terms"
          name="terms"
          type="checkbox"
          checked={formData.terms}
          onChange={handleChange}
        />
      </div>
      <button disabled={isDisabled} type="submit">
        Gönder
      </button>
    </form>
  );
}

export default Form;
