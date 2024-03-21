import { Form, Input, Button, Row, Col } from "antd";
import { useNavigate } from "react-router";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const token = sessionStorage.getItem('session_token');

    const handleRegister = async () => {

        if (password !== confPassword) {
            alert("Passwords do not match")
            return;
        }

        try {
            const response = await axios.post('http://demo2.z-bit.ee/users', {
                "username": username,
                "firstname": "test",
                "lastname": "test",
                "newPassword": password,
            }, {
                validateStatus: function (status) {
                    return status < 500; // Resolve only if the status code is less than 500
                }
            });

            if (response.status == 422) {
                alert(response.data[0].message)
                return;
            } else {
                sessionStorage.setItem('session_token', response.data.access_token);

                navigate("/");
            }
            // Save the token securely (e.g., in local storage)
        } catch (error) {
            console.error('Login failed:', error);

        }
    };

    useEffect(() => {
        if (token) {
            return navigate("/");
        }
    }, [token]);

    const login = async () => {
        navigate("/login");
    }

    return (
        <Row type="flex" justify="center" align="middle" style={{ minHeight: '100vh' }}>
            <Col span={4}>
                <h1>Register</h1>
                <Form
                    name="basic"
                    layout="vertical"
                    initialValues={{ username: "", password: "", confPassword: "" }}
                    onFinish={handleRegister}
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        label="Confirm Password"
                        name="confPassword"
                        type="password"
                        value={confPassword}
                        onChange={(e) => setConfPassword(e.target.value)}
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Register</Button>
                    </Form.Item>
                    <a onClick={() => login()}>Already have an account? Login here</a>
                </Form>
            </Col>
        </Row>
    )
}