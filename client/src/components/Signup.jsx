import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Card, Text, Button, Loading } from "@nextui-org/react";
import { z } from "zod";

import api from "lib/api";
import { NextInput } from "lib/NextComp";

const errors = {
    name: "Name should contains at least 2 characters.",
    email: "Not a valid email.",
    password: "Password should be minimum 8 chars.",
    confirmPassword: "Both Password should match exactly."
}

const Signup = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [fields, setFields] = useState([
        {
            label: "Name",
            name: "name",
            type: "text",
            ref: useRef(null),
            validation: z.string().min(2)
        },
        {
            label: "Email",
            name: "email",
            type: "text",
            ref: useRef(null),
            validation: z.string().email().min(5)
        },
        {
            label: "Password",
            name: "password",
            type: "password",
            ref: useRef(null),
            validation: z.string().min(8)
        },
        {
            label: "Confirm Password",
            name: "confirmPassword",
            type: "password",
            ref: useRef(null),
            validation: z.string().min(8)
        }
    ]);

    const emptyWarnings = () => {
        setFields(prev => prev.map(field => {
            field.helperText = "";
            field.helperColor = "";
            return field
        })
        )
    }

    const signup = async () => {
        emptyWarnings();
        const formValues = fields.reduce((acc, item) => {
            const value = item.ref.current.value;
            try {
                item.validation.parse(value);
                if (item.name === "confirmPassword" && value !== acc?.password) {
                    throw new Error("Both Password should match exactly.")
                }
                return ({ ...acc, [item.name]: value })
            } catch (error) {
                setFields(prev => prev.map(field => {
                    if (field.name === item.name) {
                        field.helperText = errors[field.name];
                        field.helperColor = "error";
                    }
                    return field
                })
                )
            }
        }, {});
        if (!formValues) return;
        setIsLoading(true);
        await api({ url: "/api/user/signup", method: "POST", body: formValues })
            .then(() => navigate("/"))
            .catch(err => setError(err?.response?.data?.message))
            .finally(() => setIsLoading(false));
    }

    const reset = () => {
        fields.forEach(item => item.ref.current.value = "");
        emptyWarnings();
    }
    return <div className="mt-6 mx-3 flex items-center flex-col">
        <Card className="my-5 max-w-4xl">
            <Card.Header css={{ justifyContent: "center" }}>
                <Text h1 size={40} css={{ textGradient: "45deg, $blue600 -20%, $pink600 50%" }} weight="bold">
                    Sign Up
                </Text>
            </Card.Header>
            <Card.Body className="p-20 gap-4">
                {fields.map(({ type, ...props }, idx) => <NextInput key={idx} props={props} type={type} />)}
            </Card.Body>
            <Card.Footer className="justify-end gap-4">
                <Text color="error">{error}</Text>
                <Button auto flat onPress={signup} >
                    {isLoading ? <Loading type="spinner" color="currentColor" size="sm" /> : "Sign Up"}
                </Button>
                <Button auto flat color="error" onPress={reset}>Reset!</Button>
            </Card.Footer>
        </Card>
        <Text h3 size={20} className="text-center mt-5">Already have an account. <Link className="ml-1 hover:underline" to="/user/signin">Sign in!</Link></Text>
    </div>
}

export default Signup;