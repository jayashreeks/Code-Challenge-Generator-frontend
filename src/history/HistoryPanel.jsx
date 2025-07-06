import React from 'react'
import { useState, useEffect } from 'react'
import MCQChallenge from '../challenge/MCQChallenge'
import {useApi} from '../utils/Api.js'


const HistoryPanel = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const {makeRequest} = useApi();

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await makeRequest("my-history")
      setHistory(response.challenges);
      console.log(response);
    }catch (err) {
      setError(err.message || 'Failed to fetch history');
    }finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  if (isLoading) {
    return <div className='loading'>Loading History...</div>;
  }
  if (error) {
    return <div className='error'>
        <p>{error}</p>
        <button onClick={() => setError(null)}>Retry
        </button>
      </div>;
  }
  return (
    <div className="history-panel">
        <h2>History</h2>
        {history.length === 0 ? <p>No challenge history</p> :
            <div className="history-list">
                {history.map((challenge) => {
                    return <MCQChallenge
                                challenge={challenge}
                                key={challenge.id}
                                showExplanation
                            />
                })}
            </div>
        }
    </div>
  )
}

export default HistoryPanel