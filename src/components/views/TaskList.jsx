import { DeleteOutlined } from "@ant-design/icons";
import { Input, Button, Checkbox, List, Col, Row, Space, Divider } from "antd";
import produce from "immer";
import React, { useState } from 'react';
import axios from 'axios';


export default function TaskList() {
    const [updatedData, setUpdatedData] = useState('');
    const [newData, setNewData] = useState('');
    const [tasks, setTasks] = useState([]);

    async function getUser(endpoint) {
        try {
            const response = await axios.get(endpoint, {
                headers: {
                    Authorization: `Bearer mEIRaj1fMtVmD6vOwdZHlHnohr4bDWRd`,
                },
            });
            let tasks = [];
            for (const data of response.data) {
                tasks.push({ id: data.id, name: data.title, completed: data.marked_as_done });
            }

            setTasks(tasks);

        } catch (error) {
            console.error(error);
        }
    }

    getUser('http://demo2.z-bit.ee/tasks');

    async function handleUpdate() {
        try {
            await axios.put('https://api.example.com/data/1', { updatedData });
            alert('Data updated successfully!');
            // Optionally, fetch and update the displayed data
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    const handleNameChange = (task, event) => {
        console.log(event)
        const newTasks = produce(tasks, draft => {
            const index = draft.findIndex(t => t.id === task.id);
            draft[index].name = event.target.value;
        });
        setTasks(newTasks);
    };

    const handleCompletedChange = (task, event) => {
        console.log(event)
        const newTasks = produce(tasks, draft => {
            const index = draft.findIndex(t => t.id === task.id);
            draft[index].completed = event.target.checked;
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
                        Authorization: `Bearer mEIRaj1fMtVmD6vOwdZHlHnohr4bDWRd`,
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
                            Authorization: `Bearer mEIRaj1fMtVmD6vOwdZHlHnohr4bDWRd`,
                        },
                    })
                alert('Data deleted successfully!');
                // Optionally, fetch and update the displayed data
            } catch (error) {
                console.error('Error deleting data:', error);
            }
        }));
    };

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
        </Row>
    )
}