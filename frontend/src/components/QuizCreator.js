import {useState} from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import CardActions from "@mui/material/CardActions";
import Input from '@mui/material/Input';
import Button from "@mui/material/Button";
import * as React from "react";
import {createQuiz} from "../requests/quizzes";
import {useNavigate} from "react-router-dom";
import {TextField} from "@mui/material";

export default function QuizCreator() {
    let navigate = useNavigate();
    const [inputs, setInputs] = useState({1: '', 2: ''});
    const [questionDescriptionInput, setQuestionDescriptionInput] = useState('');
    const [quizDescriptionInput, setQuizDescriptionInput] = useState('');
    const [quizNameInput, setQuizNameInput] = useState('');
    const [quiz, setQuiz] = useState({
        name: '',
        description: '',
        questions: []
    });

    const handleChangeOfQuestionDescriptionInput = (event) => {
        setQuestionDescriptionInput(event.target.value);
    }

    const handleChangeOfQuizDescriptionInput = (event) => {
        setQuizDescriptionInput(event.target.value);
    }

    const handleChangeOfQuizNameInput = (event) => {
        setQuizNameInput(event.target.value);
    }

    const handleChangeOfOptionInput = (event) => {
        const value = event.target.value;
        setInputs({
            ...inputs,
            [event.target.name]: value
        });
    }

    const addOption = (questionId) => {
        setQuiz({
            ...quiz,
            questions: quiz.questions.map(question => {
                if (question.id === questionId) {
                    question.options.push(inputs[questionId])
                    setInputs({
                        ...inputs,
                        [questionId]: ''
                    });
                }
                return question
            })
        })
    }

    const addQuestion = () => {
        const newQuestion = {
            id: quiz.questions.length + 1,
            description: questionDescriptionInput,
            options: []
        }
        setQuiz({
            ...quiz,
            name: quizNameInput,
            description: quizDescriptionInput,
            questions: [...quiz.questions, newQuestion]
        })
        setInputs({...inputs, [newQuestion.id]: ''})
        setQuestionDescriptionInput('')
    }

    const publishQuiz = async () => {
        await createQuiz(quiz);
        setQuizNameInput('');
        setQuizDescriptionInput('');
        navigate(`/api/zoomapp/proxy`)
    }

    return <>
        <div>
            <Input placeholder='Enter name of quiz' sx={{margin: 2}} value={quizNameInput}
                   onChange={handleChangeOfQuizNameInput}/>
        </div>
        <div>
            <TextField placeholder='Enter description of quiz' sx={{margin: 2, width: 300}} value={quizDescriptionInput} multiline
                   onChange={handleChangeOfQuizDescriptionInput}/>
        </div>
        {quiz.questions.map(question =>
            <Card
                sx={{minWidth: 275, maxWidth: 500, display: 'flex', justifyContent: 'center', flexDirection: 'column', margin: 2}}
                key={question.id}>
                <CardContent>
                    <FormControl>
                        <FormLabel id="demo-controlled-radio-buttons-group">{question.description}</FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                        >
                            {question.options.map((options, id) =>
                                <FormControlLabel kay={id} value={id} control={<Radio/>} label={options}/>
                            )
                            }
                        </RadioGroup>
                    </FormControl>
                </CardContent>
                <Input placeholder='Enter option' sx={{margin: 2}} name={question.id} value={inputs[question.id]}
                       onChange={handleChangeOfOptionInput} key={question.id}/>
                <CardActions sx={{alignSelf: 'flex-end'}}>
                    <Button size="small" onClick={() => addOption(question.id)}>Add</Button>
                </CardActions>
            </Card>
        )}
        <div>
            <Input placeholder='Enter description' sx={{margin: 2}} value={questionDescriptionInput}
                   onChange={handleChangeOfQuestionDescriptionInput}/>
            <Button size="small" sx={{margin: 5}} variant="contained" onClick={addQuestion}>Add new question</Button>
        </div>
        <Button size="small" sx={{margin: 5}} variant="contained" onClick={publishQuiz}>Publish</Button>
        <Button size="small" sx={{margin: 5}} variant="contained" onClick={() => navigate('/api/zoomapp/proxy')}>Back</Button>
    </>
}
