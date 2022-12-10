import axios from "axios";

export const HOST_BACK = process.env.REACT_APP_PUBLIC_ROOT
export const getQuizzes = async () => {
  const res = await axios.get(
      `${HOST_BACK}/quizzes`
  );
  return res.data;
}

export const testQuizzes = async () => {
  const res = await axios.post(
      `${HOST_BACK}/quizzes/test`, {}
  );
  return res.data;
}

export const createQuiz = async (quiz) => {
  await axios.post(
    `${HOST_BACK}/quizzes`,
    quiz
  );
}

export const sendQuizAnswer = async (quizId, answers) => {
  await axios.post(
    `${HOST_BACK}/quizzes/${quizId}`,
    answers
  );
}

export const authenticate = async () => {
  const {data} = await axios.get(
    `${HOST_BACK}/user/info`
  );
  return data;
}

export const getQuizz = async (id) => {
  const res = await axios.get(
    `${HOST_BACK}/quizzes/${id}`
  );
  return res.data;
}

export const getReport = async (id) => {
  try {
    const res = await axios.get(
      `${HOST_BACK}/quizzes/report/${id}`
    );
    return res.data;
  } catch (e) {
    return null;
  }
}

export const authorize = async () => {
  const {data} = await axios.get(
    `${HOST_BACK}/api/zoomapp/authorize`
  );
  return data;
}


export const onAuthorize = async (code, state, href) => {
  const {data} = await axios.post(
    `${HOST_BACK}/api/zoomapp/onauthorized`,
    {
      code,
      state,
      href,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return data;
}
