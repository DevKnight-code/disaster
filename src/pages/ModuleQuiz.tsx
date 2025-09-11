import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

type Question = { question: string; options: string[]; answer: string };

const QUESTIONS: Record<string, Question[]> = {
  'Earthquake Safety': [
    { question: 'What is the safest action during an earthquake if you are indoors?', options: ['Run outside quickly','Stand near windows','Drop, Cover, and Hold On','Use elevators'], answer: 'Drop, Cover, and Hold On' },
    { question: 'Where should you take cover during an earthquake?', options: ['Under a sturdy table','Next to glass doors','On the balcony','Inside elevators'], answer: 'Under a sturdy table' },
    { question: 'What should you avoid after an earthquake?', options: ['Checking for injuries','Listening to emergency updates','Using elevators','Helping others'], answer: 'Using elevators' },
    { question: 'What should you do if you are outside during an earthquake?', options: ['Stay near tall buildings','Move to open space','Go under trees','Run to the nearest room'], answer: 'Move to open space' },
    { question: 'What is the first thing you should do after an earthquake stops?', options: ['Rush back inside','Check for injuries and hazards','Turn on gas','Ignore aftershocks'], answer: 'Check for injuries and hazards' },
    { question: 'Why should you stay away from windows during an earthquake?', options: ['For better air circulation','Risk of shattering glass','More sunlight','Easier to escape'], answer: 'Risk of shattering glass' },
    { question: 'What is an aftershock?', options: ['A larger main earthquake','A smaller earthquake following the main one','Tsunami waves','Electrical shock'], answer: 'A smaller earthquake following the main one' },
    { question: 'Which emergency kit item is MOST essential for earthquakes?', options: ['Water and food','Television','Sports equipment','Books'], answer: 'Water and food' },
    { question: 'What should you NOT do when driving during an earthquake?', options: ['Stop safely','Park away from bridges','Stay in the car','Stop under an overpass'], answer: 'Stop under an overpass' },
    { question: 'Which system is used worldwide to measure earthquake magnitude?', options: ['Beaufort scale','Richter scale','Mercalli scale','Barometer'], answer: 'Richter scale' },
  ],
  'Fire Safety & Evacuation': [
    { question: 'What is the first step if you discover a fire?', options: ['Hide under a table','Raise the alarm','Use the lift','Ignore it'], answer: 'Raise the alarm' },
    { question: 'Which extinguisher is used for electrical fires?', options: ['Water','Foam','CO2','Sand'], answer: 'CO2' },
    { question: 'What number should you dial in India for fire emergencies?', options: ['101','102','108','112'], answer: '101' },
    { question: 'What should you avoid using during a fire evacuation?', options: ['Stairs','Fire exits','Elevators','Emergency alarms'], answer: 'Elevators' },
    { question: 'What should you do if your clothes catch fire?', options: ['Run fast','Stop, Drop, and Roll','Jump in place','Hide'], answer: 'Stop, Drop, and Roll' },
    { question: 'What is the safe way to exit a smoke-filled room?', options: ['Walk upright','Run fast','Crawl low','Close eyes'], answer: 'Crawl low' },
    { question: 'Which fire class involves flammable liquids?', options: ['Class A','Class B','Class C','Class D'], answer: 'Class B' },
    { question: 'What should you check before opening a door during a fire?', options: ['If it is locked','If it is hot','If it has glass','If it is painted'], answer: 'If it is hot' },
    { question: 'Why is it important to know fire exit routes?', options: ['For decoration','For safety evacuation','To avoid alarms','For storage'], answer: 'For safety evacuation' },
    { question: 'What should you do after reaching outside during a fire?', options: ['Re-enter to save belongings','Wait for fire services','Run far away','Hide near exit'], answer: 'Wait for fire services' },
  ],
  'Flood Response': [
    { question: 'What is the first step if a flood warning is issued?', options: ['Ignore it','Move to higher ground','Go swimming','Stay in basement'], answer: 'Move to higher ground' },
    { question: 'What should you avoid walking through in floods?', options: ['Clean roads','Moving water','Dry areas','Shelters'], answer: 'Moving water' },
    { question: 'Why should you avoid driving in flooded areas?', options: ['Car gets dirty','Risk of stalling or being swept away','Traffic jams','Expensive fuel'], answer: 'Risk of stalling or being swept away' },
    { question: 'Which emergency kit item is most important in floods?', options: ['Torch and batteries','Television','Toys','Paint'], answer: 'Torch and batteries' },
    { question: 'What diseases are common after floods?', options: ['Cold','Waterborne diseases','Fractures','Sunburn'], answer: 'Waterborne diseases' },
    { question: 'What should you do before a flood disaster?', options: ['Ignore warnings','Prepare emergency kit','Go on vacation','Turn off alarms'], answer: 'Prepare emergency kit' },
    { question: 'What is the safe practice when returning home after flood?', options: ['Turn on electricity immediately','Check for structural damage','Ignore watermarks','Stay outside forever'], answer: 'Check for structural damage' },
    { question: 'What should you avoid drinking during flood disasters?', options: ['Boiled water','Bottled water','Unclean water','Filtered water'], answer: 'Unclean water' },
    { question: 'What is a common sign of a flash flood?', options: ['Clear sky','Rapid rise in water level','Snowfall','Dry roads'], answer: 'Rapid rise in water level' },
    { question: 'Which communication tool works best during floods?', options: ['Internet only','Battery-powered radio','TV','None'], answer: 'Battery-powered radio' },
  ],
  'Medical Emergency': [
    { question: 'What is the first step in first aid?', options: ['Check for danger','Call a friend','Run away','Ignore patient'], answer: 'Check for danger' },
    { question: 'What number should you dial in India for medical emergencies?', options: ['100','101','102','108'], answer: '108' },
    { question: 'What is CPR used for?', options: ['Treating burns','Restarting breathing and heartbeat','Curing fever','Cleaning wounds'], answer: 'Restarting breathing and heartbeat' },
    { question: 'How many chest compressions are given in CPR for adults?', options: ['15','20','30','10'], answer: '30' },
    { question: 'What should you do in case of severe bleeding?', options: ['Wash with water only','Apply pressure to wound','Ignore it','Cover with ice'], answer: 'Apply pressure to wound' },
    { question: 'Which position is safe for an unconscious breathing person?', options: ['On back','Recovery position','Standing','Upside down'], answer: 'Recovery position' },
    { question: 'What should you NOT do in case of burns?', options: ['Cool with running water','Cover with clean cloth','Apply ice directly','Keep area elevated'], answer: 'Apply ice directly' },
    { question: 'Which item is essential in a first aid kit?', options: ['Bandages','Perfume','Books','Snacks'], answer: 'Bandages' },
    { question: 'What should you do if someone is choking?', options: ['Give water','Perform Heimlich maneuver','Lay them down','Slap their face'], answer: 'Perform Heimlich maneuver' },
    { question: 'What should you do before giving any medicine?', options: ['Ask doctor or medical professional','Guess and give','Check internet only','Ignore'], answer: 'Ask doctor or medical professional' },
  ],
};

export default function ModuleQuiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const moduleName = (location.state?.moduleName as string) || 'Earthquake Safety';
  const questions = useMemo(() => QUESTIONS[moduleName] || [], [moduleName]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const onSubmit = async () => {
    const current = questions[idx];
    const isCorrect = selected === current.answer;
    const increment = isCorrect ? 1 : 0;
    if (isCorrect) {
      setScore((s) => s + 10);
      setCorrectCount((c) => c + 1);
    }
    // persist progress when answer is submitted
    const token = localStorage.getItem('token');
    if (token && increment) {
      await fetch('/api/students/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ moduleKey: moduleName, correctIncrement: increment }),
      }).catch(() => {});
    }
    setSelected(null);
    if (idx + 1 < questions.length) {
      setIdx(idx + 1);
    } else {
      navigate('/student');
    }
  };

  const progressPercent = Math.min(100, correctCount * 10);

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>{moduleName} Quiz</CardTitle>
          <CardDescription>10 questions • +10 points per correct answer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span>{progressPercent}% • {score} pts</span>
            </div>
            <Progress value={progressPercent} className="mt-2" />
          </div>

          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">Question {idx + 1} of {questions.length}</div>
            <div className="text-base font-medium text-foreground">{questions[idx]?.question}</div>
            <div className="grid gap-2">
              {questions[idx]?.options.map((opt) => (
                <Button key={opt} variant={selected === opt ? 'default' : 'outline'} onClick={() => setSelected(opt)}>
                  {opt}
                </Button>
              ))}
            </div>
            <div className="flex justify-end">
              <Button onClick={onSubmit} disabled={!selected}>Submit</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


