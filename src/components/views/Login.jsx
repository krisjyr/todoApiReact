import { Form, Input, Button, Row, Col } from "antd";
import { useNavigate } from "react-router";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const token = sessionStorage.getItem('session_token');

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://demo2.z-bit.ee/users/get-token', {
                username,
                password,
            });

            sessionStorage.setItem('session_token', response.data.access_token);

            navigate("/");
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

    return (
        <Row type="flex" justify="center" align="middle" style={{ minHeight: '100vh' }}>
            <Col span={4}>
                <h1>Login</h1>
                <Form
                    name="basic"
                    layout="vertical"
                    initialValues={{ username: "", password: "" }}
                    onFinish={handleLogin}
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
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Login</Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    )
}