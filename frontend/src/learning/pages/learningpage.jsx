import LearningHome from "./learninghome.jsx";
import { useNavigate } from "react-router-dom";

const LearningPage = () => {
  const navigate = useNavigate();

  const goToSubject = (subject) => {
    console.log("Selected subject:", subject);
    navigate(`/subject/${subject.id}`);
  };

  return <LearningHome goToSubject={goToSubject} />;
};

export default LearningPage;