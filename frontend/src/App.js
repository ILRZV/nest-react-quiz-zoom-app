/* globals zoomSdk */
import { useEffect, useState } from "react";
import { apis } from "./apis";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {authorize, onAuthorize} from "./requests/quizzes";
import QuizzesList from "./components/QuizzesList";
import {Route, Routes} from "react-router-dom";
import QuizCreator from "./components/QuizCreator";
import Quiz from "./components/Quiz";

// let once = 0; // to prevent increasing number of event listeners being added

function App() {
  const [counter, setCounter] = useState(0);
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    async function configureSdk() {
      const configTimer = setTimeout(() => {
        setCounter(counter + 1);
      }, 120 * 60 * 1000);
      try {
       await zoomSdk.config({
          capabilities: [
            ...apis.map((api) => api.name), // IMPORTANT

            // demo events
            "onSendAppInvitation",
            "onShareApp",
            "onActiveSpeakerChange",
            "onMeeting",

            // connect api and event
            "connect",
            "onConnect",
            "postMessage",
            "onMessage",

            // in-client api and event
            "authorize",
            "onAuthorized",
            "promptAuthorize",
            "getUserContext",
            "onMyUserContextChange",
            "sendAppInvitationToAllParticipants",
            "sendAppInvitation",
          ],
          version: "0.16.0",
        });
      } catch (error) {
        console.log(error);
      }
      return () => {
        clearTimeout(configTimer);
      };
    }
    const fetchData = async () => {
      await configureSdk();
      let authorizeResponse;
      try {
        authorizeResponse = await authorize();
        if (!authorizeResponse || !authorizeResponse.codeChallenge) {
          console.error(
            "Error in the authorize flow - likely an outdated user session.  Please refresh the app"
          );
          return;
        }
      } catch (e) {
        console.error(e);
      }
      const { codeChallenge, state } = authorizeResponse;

      const authorizeOptions = {
        codeChallenge: codeChallenge,
        state: state,
      };
      try {
        await zoomSdk.authorize(authorizeOptions);
      } catch (e) {
        console.error(e);
      }
      zoomSdk.addEventListener("onAuthorized", async (event) => {
        const { code, state } = event;
        const user = await onAuthorize(code, state, window.location.href);
        setConfigured(true);
        console.log(user);
      });
    }
    fetchData();
  }, [counter]);



  return (
    <div className="App">
      {configured &&
        <Routes>
          <Route
            path={'/api/zoomapp/proxy'}
            element={<QuizzesList/>}
          />
          <Route
            path={'/api/zoomapp/proxy/quiz/:id'}
            element={<Quiz/>}
          />
          <Route
            path={'/api/zoomapp/proxy/quiz/new'}
            element={<QuizCreator/>}
          />
        </Routes>
      }
    </div>
  );
}

export default App;
