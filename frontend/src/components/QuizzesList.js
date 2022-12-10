import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import {Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {getQuizzes, HOST_BACK, testQuizzes} from "../requests/quizzes"
import {io} from "socket.io-client";

export default function QuizzesList() {
    let navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [piu, setPiu] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const data = await getQuizzes();
            setQuizzes(data);
        }
        fetchData()
            .catch(console.error);
    }, []);

    useEffect(() => {
        const socket = io(HOST_BACK);
        socket.on('connect', function() {
            socket.emit('events', {});
        });
        socket.on('events', function(data) {
            setQuizzes((state) => [data, ...state])
        });
        return () => {
            socket.off('connect');
            socket.off('events');
        };
    }, []);


    return (
        <>
            <Button size="small" sx={{margin: 5}} variant="contained" onClick={() => navigate('/api/zoomapp/proxy/quiz/new')}>Create new
                quiz</Button>
            {quizzes.map((quiz) =>
                <Card key={quiz.id} sx={{
                    minWidth: 275,
                    maxWidth: 500,
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    margin: 2
                }}>
                    <CardContent sx={{display: 'flex', justifyContent: 'space-between'}}>
                      <div>
                        <Typography variant="h5" component="div">
                            {quiz.name}
                        </Typography>
                        <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                            {quiz.description}
                        </Typography>
                      </div>
                      <Typography sx={{fontSize: 10}} color="text.secondary" gutterBottom>
                        {quiz.userCreator.firstName} {quiz.userCreator.lastName}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{alignSelf: 'flex-end'}}>
                        <Button size="small" onClick={() => navigate(`/api/zoomapp/proxy/quiz/${quiz.id}`)}>Learn More</Button>
                    </CardActions>
                </Card>
            )}
        </>
    )
}
