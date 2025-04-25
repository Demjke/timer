import { useEffect, useState } from "react";
import { ReactComponent as Reset } from "../../assets/images/close.svg";
import CompletedImg from "../../assets/images/completed.png";
import { ReactComponent as Pause } from "../../assets/images/pause.svg";
import { ReactComponent as Play } from "../../assets/images/play.svg";

const App = () => {
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [secondsInput, setSecondsInput] = useState("");
    const [timer, setTimer] = useState("");
    const [isPlay, setIsPlay] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [totalSeconds, setTotalSeconds] = useState(0);
    const [initialSeconds, setInitialSeconds] = useState(0);

    const formatedTime = value =>
        value >= 60
            ? setTimer(
                  `${Math.floor(value / 60)
                      .toString()
                      .padStart(2, "0")}:${(value % 60).toString().padStart(2, "0")}`
              )
            : setTimer(`00:${value.toString().padStart(2, "0")}`);

    const handleStartTimer = e => {
        const value = +e.target.value;
        formatedTime(value);
        setTotalSeconds(value);
        setInitialSeconds(value);
        setSecondsInput("");
    };

    const handleReset = () => {
        setTimer("");
        setTotalSeconds(0);
        setInitialSeconds(0);
        setIsPlay(false);
        setIsCompleted(false);
        setSecondsInput("");
    };

    const handlePlay = () => {
        if (totalSeconds > 0) {
            setIsPlay(true);
        }
    };

    const handlePause = () => {
        setIsPlay(false);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let interval;
        if (isPlay && totalSeconds > 0) {
            formatedTime(totalSeconds);
            interval = setInterval(() => {
                setTotalSeconds(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setIsPlay(false);
                        setIsCompleted(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlay, totalSeconds]);

    const progress = initialSeconds > 0 ? (1 - totalSeconds / initialSeconds) * 360 : 0;

    return (
        <div className="app">
            <div className="container">
                <div className="timer">
                    <div className="timer-time">{currentTime}</div>
                    <div className="timer-circle" style={{ "--progress": `${progress}deg` }}>
                        {isCompleted ? (
                            <div className="timer-completed">
                                <img src={CompletedImg} alt="Completed" />
                            </div>
                        ) : timer ? (
                            <div className="timer-num">{timer}</div>
                        ) : (
                            <input
                                type="number"
                                placeholder="00:00"
                                onChange={e => setSecondsInput(e.target.value)}
                                value={secondsInput}
                                autoFocus
                                onBlur={handleStartTimer}
                                className="timer-input"
                            />
                        )}
                    </div>
                    <div className="timer-reset" onClick={handleReset}>
                        <Reset />
                    </div>
                    {isPlay ? (
                        <div className="timer-play" onClick={handlePause}>
                            <Pause />
                        </div>
                    ) : (
                        <div className="timer-pause" onClick={handlePlay}>
                            <Play />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;
