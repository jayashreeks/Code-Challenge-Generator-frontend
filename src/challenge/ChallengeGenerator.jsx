import React from 'react'
import {useState, useEffect} from 'react'
import MCQChallenge from './MCQChallenge.jsx'
import {useApi} from '../utils/api.js'

const ChallengeGenerator = () => {
const [challenge, setChallenge] = useState(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);
const [difficulty, setDifficulty] = useState('easy');
const [quota, setQuota] = useState(null);
const {makeRequest} = useApi();

useEffect(() => {
  fetchQuota();
}, []); // Fetch quota on component mount

const fetchQuota = async () => {
  try {
    const response = await makeRequest('quota');
    setQuota(response);
  } catch (err) {
    console.log(err.message || 'Failed to fetch quota');
  }
}

const generateChallenge = async () => {
  setIsLoading(true);
  setError(null);
  try {
    const response = await makeRequest('generate-challenge',{
      method: 'POST',
      body: JSON.stringify({difficulty}),
    });
    console.log(response.difficulty)
    setChallenge(response);
    fetchQuota(); // Refresh quota after generating a challenge
  } catch (err) {
    setError(err.message || 'Failed to generate challenge');
  }finally {
    setIsLoading(false);  
  }
}

const getNextResetTime = () => {
  if (!quota?.last_reset_date) return null;
  const resetDate = new Date(quota.last_reset_date);
  resetDate.setHours(resetDate.getHours() + 24);
  return resetDate.toLocaleString();
}

  return (
    <div className='challenge-container'>
      <h2>Coding Challenge Generator</h2>
      <div className='quota-display'>
        <p>Challenges remaining today: {quota?.quota_remaining ||0}</p>
        {quota?.quota_remaining ===0 && (
          <p>Next reset: {getNextResetTime()}</p>
        )}
      </div>
      <div className='difficulty-selector'>
        <label htmlFor='difficulty'>Select Difficulty:</label>
        <select id='difficulty' value={difficulty} onChange={(e) => setDifficulty(e.target.value)} disabled={isLoading}>
          <option value='easy'>Easy</option>
          <option value='medium'>Medium</option>
          <option value='hard'>Hard</option>
        </select>
      </div>

      <button className='generate-button' onClick={generateChallenge} disabled={false}>
        {isLoading ? 'Generating...' : 'Generate Challenge'}
      </button>
      {error && <div className='error-message'><p>Error: {error}</p></div>}
      {challenge && (
        <div className='challenge-display'>
          <h3>Generated Challenge</h3>
          <MCQChallenge challenge={challenge} />
        </div>
      )}
    </div>
  )
}

export default ChallengeGenerator