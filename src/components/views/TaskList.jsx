import { DeleteOutlined } from "@ant-design/icons";
import { Input, Button, Checkbox, List, Col, Row, Space, Divider } from "antd";
import produce from "immer";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router";


export default function TaskList() {
    const token = sessionStorage.getItem('session_token');
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();

     async function getUser(endpoint) {
        try {
            const response = await axios.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            let tasks = [];
            const damn = response
            console.log(damn)
            for (const data of damn.data) {
                tasks.push({ id: data.id, name: data.title, completed: data.marked_as_done });
            }

            setTasks(tasks);

        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (!token) {
            return navigate("/login");
        }
        getUser('http://demo2.z-bit.ee/tasks');
    }, [token]);

    const handleNameChange = (task, event) => {
        console.log(event)
        const newTasks = produce(tasks, draft => {
            const index = draft.findIndex(t => t.id === task.id);
            draft[index].name = event.target.value;

            try {
                axios.put(`http://demo2.z-bit.ee/tasks/${task.id}`, {
                    title: draft[index].name,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } catch (error) {
                console.error(error);
            }
        });
        setTasks(newTasks);
    };

    const handleCompletedChange = (task, event) => {
        console.log(event)
        const newTasks = produce(tasks, draft => {
            const index = draft.findIndex(t => t.id === task.id);
            draft[index].completed = event.target.checked;

            try {
                axios.put(`http://demo2.z-bit.ee/tasks/${task.id}`, {
                    marked_as_done: draft[index].completed
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } catch (error) {
                console.error(error);
            }
        });
        setTasks(newTasks);
    };

    const handleAddTask = () => {

        try {
            let id, name, completed;
            axios.post('http://demo2.z-bit.ee/tasks',
                {
                    title: `Crazy ${tasks.length + 1} Task`,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(response => {
                    id = response.data.id;
                    name = response.data.title;
                    completed = response.data.marked_as_done;
                    setTasks(produce(tasks, draft => {
                        draft.push(
                            { id: id, name: name, completed: completed }
                        );
                    }));
                })
            alert('Data created successfully!')

        } catch (error) {
            console.error('Error creating data:', error);
        }
    }



    const handleDeleteTask = (task) => {
        setTasks(produce(tasks, draft => {
            const index = draft.findIndex(t => t.id === task.id);
            draft.splice(index, 1);

            try {
                axios.delete(`http://demo2.z-bit.ee/tasks/${task.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                alert('Data deleted successfully!');
                // Optionally, fetch and update the displayed data
            } catch (error) {
                console.error('Error deleting data:', error);
            }
        }));
    };

    const logout = async () => {
        navigate("/logout");
    }

    return (
        <Row type="flex" justify="center" style={{ minHeight: '100vh', marginTop: '6rem' }}>
            <Col span={12}>
                <h1>Task List</h1>
                <Button onClick={handleAddTask}>Add Task</Button>
                <Divider />
                <List
                    size="small"
                    bordered
                    dataSource={tasks}
                    renderItem={(task) => <List.Item key={task.id}>
                        <Row type="flex" justify="space-between" align="middle" style={{ width: '100%' }}>
                            <Space>
                                <Checkbox checked={task.completed} onChange={(e) => handleCompletedChange(task, e)} />
                                <Input value={task.name} onChange={(event) => handleNameChange(task, event)} />
                            </Space>
                            <Button type="text" onClick={() => handleDeleteTask(task)}><DeleteOutlined /></Button>
                        </Row>
                    </List.Item>}
                />
            </Col>
            <Button type="primary" onClick={() => logout()}>Logout</Button>
        </Row>
    )
}