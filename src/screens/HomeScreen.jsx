import React, { useState } from 'react';
import HeaderBase from "../components/HeaderBase";
import { ReactComponent as AwardIcon } from "../assets/award.svg";
import { ReactComponent as NoteIcon } from "../assets/note.svg";
import { ReactComponent as MadeLove } from "../assets/madelove.svg";
import { ReactComponent as Product } from "../assets/product.svg";
import ButtonWithLogo from "../components/ButtonWithLogo";
import { convertQuestionToMarkdownAndDownload, convertLectureNotesToMarkdownAndDownload } from '../services/download';
import { generateFeedback } from '../services/generateFeedback';
import questions from "../services/questions.json";
import userChoice from "../services/userChoice.json";

const HomeScreen = ({ onNavigate, lectureTitle, handleTranscribe, transcriptText }) => {
  const [userPerformance, setUserPerformance] = useState("");
  const handleGenerateFeedback = async () => {
    try {
      const feedback = await generateFeedback(transcriptText, questions, userChoice);
      setUserPerformance(feedback); // Update state with feedback
    } catch (error) {
      console.error("Error generating feedback:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        height: "90vh",
        padding: "10px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%" }}>
        <HeaderBase />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          textAlign: "center",
          flexGrow: 1,
        }}
      >
        <Product/>
        <h3
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            fontSize: "16px",
            color: "#6B6B6B",
          }}
        >
          What type of learning resources are you looking for today?
        </h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            padding: "0 20px",
            boxSizing: "border-box",
            gap: 10,
          }}
        >
          <ButtonWithLogo
            text="Quizzes"
            color="#D5016C"
            icon={AwardIcon}
            onClick={() => onNavigate("quiz")}
            fullWidth={true}
          />

          <ButtonWithLogo
            text="Lecture Notes"
            color="#90268E"
            icon={NoteIcon}
            onClick={() => onNavigate("notes")}
            fullWidth={true}
          />
      <button onClick={() => convertQuestionToMarkdownAndDownload(lectureTitle)}>Download Question</button>
      <button onClick={() => convertLectureNotesToMarkdownAndDownload(lectureTitle)}>Download Lecture Notes</button>
      <button onClick={handleGenerateFeedback}>Generate Feedback</button>
      <button onClick={() => onNavigate("feedback")}>Feedback</button>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px 0",
        }}
      >
        <MadeLove />
      </div>
      <pre>{JSON.stringify(userPerformance, null, 2)}</pre>
    </div>
  );
};

export default HomeScreen;
