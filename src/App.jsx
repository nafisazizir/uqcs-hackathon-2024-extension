/* global chrome */
import React, { useState, useEffect, useCallback } from "react";
import SidebarBase from "./components/SidebarBase";
import HomeScreen from "./screens/HomeScreen";
import QuizScreen from "./screens/QuizScreen";
import LectureNotesScreen from "./screens/LectureNotesScreen";
import WaitingScreen from "./screens/WaitingScreen";
import "./components/SidebarBase/SidebarBase.css";
import "./App.css";
import WelcomeScreen from "./screens/WelcomeScreen";
import FeedbackScreen from "./screens/FeedbackScreen";
import userChoice from "./services/userChoice.json"


const App = () => {
  const [currentScreen, setCurrentScreen] = useState("welcome");
  const [lectureTitle, setLectureTitle] = useState("");
  const [transcriptText, setTranscriptText] = useState("");
  const [questions, setQuestions] = useState([]);
  const [lectureNotes, setLectureNotes] = useState("No lecture notes generated yet.");

  useEffect(() => {
    const messageListener = (message, sender, sendResponse) => {
      if (message.action === "LECTURE_DATA") {
        setLectureTitle(message.title);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => chrome.runtime.onMessage.removeListener(messageListener);
  }, []);

  useEffect(() => {
    localStorage.clear()
  }, []);

  const handleTranscribe = useCallback(() => {
    setTranscriptText("Fetching lecture transcript...");
    chrome.runtime.sendMessage({ action: "GET_LECTURE_DATA" }, (response) => {
      if (response.error) {
        setLectureTitle(`Error: ${response.error}`);
      } else {
        setLectureTitle(response.title);
        console.log(response.title);
      }
    });
    
    chrome.runtime.sendMessage({ action: "GET_TRANSCRIPT" }, (response) => {
      if (response.error) {
        setTranscriptText(`Error: ${response.error}`);
      } else {
        setTranscriptText(response);
      }
    });
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case "welcome":
        return <WelcomeScreen
          onNavigate={setCurrentScreen}
          handleTranscribe={handleTranscribe}
        />;
      case "home":
        return <HomeScreen 
          onNavigate={setCurrentScreen}
          lectureTitle={lectureTitle}
          handleTranscribe={handleTranscribe}
          transcriptText={transcriptText}
        />;
      case "quiz":
        return <QuizScreen 
          questions={questions}
          setQuestions={setQuestions}
          transcriptText={transcriptText}
          onNavigate={setCurrentScreen}
        />;
      case "notes":
        return <LectureNotesScreen 
          lectureNotes={lectureNotes}
          setLectureNotes={setLectureNotes}
          transcriptText={transcriptText}
          onNavigate={setCurrentScreen}
        />;
      case "feedback":
        return <FeedbackScreen 
          transcriptText={transcriptText}
          onNavigate={setCurrentScreen}
          questions={questions}
          userChoice={userChoice}
        />;
      default:
        return <WelcomeScreen onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <SidebarBase>
      <div className="App">
        {renderScreen()}
      </div>
    </SidebarBase>
  );
};

export default App;
