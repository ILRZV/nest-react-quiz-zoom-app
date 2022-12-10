import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import { getQuizz, getReport, sendQuizAnswer} from "../requests/quizzes";
import {Box} from "@mui/material";
import {io} from "socket.io-client";

export default function Quiz() {
  let navigate = useNavigate();
  const params = useParams();
  const [load, setLoad] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [quiz, setQuiz] = useState({});
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getQuizz(params.id);
      const report = await getReport(params.id)
      if(report) {
        setReport(report);
      }
      setQuiz(data);
      if (data.answers) setUserAnswers(data.answers);
      setLoad(true)
    }
    fetchData()
      .catch(console.error);
  }, []);


  const answerQuestion = (questionId, answerId) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answerId
    }))
  }

  const answerQuiz = async () => {
    const a = await sendQuizAnswer(params.id, userAnswers)
    console.log(a);
  }

  return (
    <>
      {load && quiz.questions.map(question =>
        <Card
          sx={{
            minWidth: 275,
            maxWidth: 500,
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            margin: 2
          }}>
          <CardContent>
            <FormControl>
              <FormLabel id="demo-controlled-radio-buttons-group">{question.description}</FormLabel>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
              >
                {question.options.map((options, id) =>
                  <Box sx={{display: 'flex', flexDirection: 'raw', width: 400, justifyContent: 'space-between'}}>
                    <FormControlLabel value={id} control={<Radio/>} label={options}
                                    checked={(userAnswers[question.id] || userAnswers[question.id] === 0) && userAnswers[question.id] == id}
                                    onClick={() => answerQuestion(question.id, id)}
                    />
                    <div>{report ? report[question.id] && report[question.id][id] || 0 : ''}</div>
                  </Box>
                )
                }
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>
      )}
      <Button size="small" sx={{margin: 5}} variant="contained"
              onClick={() => navigate('/api/zoomapp/proxy')}>Back</Button>
      <Button size="small" sx={{margin: 5}} variant="contained"
              onClick={answerQuiz}>Send answer</Button>
    </>
  );
}
