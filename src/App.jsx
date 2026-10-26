import { useEffect, useState, useRef } from 'react';
import { url } from './constants';

import RecentSearch from './components/RecentSearch';
import QuestionAnswer from './components/QuestionAnswer';

function App() {

  const [question, setQuestion] = useState('');

  const [result, setResult] = useState([]);

  // For maintaining history
  const [recentHistory, setRecentHistory] = useState(JSON.parse(localStorage.getItem('history')))

  // For showing searched result on clicking any previous search history
  const [selectedHistory, setSelectedHistory] = useState('');

  const scrollToAns = useRef();

  const [loader, setLoader] = useState(false);


  const askQuestion = async (queryToAsk) => {
  // Determine active question
  const activeQuestion = (queryToAsk || question || selectedHistory || '').trim();

  if (!activeQuestion) return false;

  // Format with capitalized first letter
  const formattedQuestion = activeQuestion.charAt(0).toUpperCase() + activeQuestion.slice(1);

  // Update history (Deduplicated & limited to 20 items)
  setRecentHistory((prevHistory) => {
    // 1. Remove duplicate if it exists
    const filteredHistory = prevHistory.filter((item) => item !== formattedQuestion);
    
    // 2. Add new question to top and slice to keep only the latest 20 items
    const updatedHistory = [formattedQuestion, ...filteredHistory].slice(0, 20);

    // 3. Save sliced array to LocalStorage
    localStorage.setItem('history', JSON.stringify(updatedHistory));
    
    return updatedHistory;
  });


    const payloadData = question ? question : selectedHistory;

    const payload = {
      "contents": [{
        "parts": [{ "text": payloadData }]
      }]
    }

    // For showing loader while fetching data
    setLoader(true);

    // Adding API to fetch response given by AI
    let response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(payload)
    })

    response = await response.json();

    // On console we can see that every new data set has {"*"} as first character.
    // hence we split the data on the basis of {"*"} and store it into array.

    let dataString = response.candidates[0].content.parts[0].text;
    dataString = dataString.split("* ");

    // For trimming "/" and " "(spaces) from the fetched data
    dataString = dataString.map((item) => item.trim());

    // For printing the array of data on console
    // console.log(dataString)

    // For displaying response on UI with previous asked question with answer above current asked question 

    setResult([...result, { type: 'q', text: question ? question : selectedHistory }, { type: 'a', text: dataString }])

    // For making input area of UI empty after asking queation
    setQuestion('');

    // For scrolling down to crurrent asked question
    setTimeout(() => {
      scrollToAns.current.scrollTop = scrollToAns.current.scrollHeight;
    }, 500)

    // if data is fetched then remove loader
    setLoader(false)
  }


  console.log(result);

  // For asking question by pressing enter key
  const isEnter = () => {
    if (event.key == 'Enter') {
      askQuestion();
    }
  }

 

  // for previous selected history search result show
  useEffect(() => {
    askQuestion();
  }, [selectedHistory])


  // Dark Mode feature
  const [darkMode, setDarkMode] = useState('dark');
  useEffect(()=>{
    // for checking on console that what we select get selected or not {dark,light}
    console.log(darkMode); 
    // for adding removing dark keyword in HTML file {see html file changing on console}
    if(darkMode=='dark'){
      document.documentElement.classList.add('dark');
    }else{
      document.documentElement.classList.remove('dark');
    }
  },[darkMode])


  return (
    <div className={darkMode==='dark'?'dark': 'light'}>
    {/* Dark mode button */}
    <div className=" grid grid-cols-5 h-screen text-center">
      <select onChange={(event)=>setDarkMode(event.target.value)} className='fixed dark:text-white text-zinc-700 bottom-5 left-3'>
        <option value="dark" className='bg-zinc-800'>Dark</option>
        <option value="light" className='bg-zinc-800' >Light</option>
      </select>

      <RecentSearch recentHistory={recentHistory} setRecentHistory={setRecentHistory} setSelectedHistory={setSelectedHistory}/>

      <div className="col-span-4 p-10">

         <h1 className='text-4xl p-4 bg-clip-text text-transparent bg-linear-to-r from-blue-500 to-orange-400'>Hello user, Ask me Anything</h1>
        
        {/* Loader  */}
        {
          loader ?
            <div role="status">
              <svg aria-hidden="true" className="inline w-8 h-8 text-neutral-tertiary animate-spin fill-purple" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
              <span className="sr-only">Loading...</span>
            </div> : null
        }

        <div ref={scrollToAns} className='continer h-110 overflow-scroll' >
          <div className=' dark:text-white text-zinc-900'>

            <ul>
              {
                result.map((item, index) => (

                  <QuestionAnswer key={index} item={item} index={index}/>

                ))
              }
            </ul>

          </div>
        </div>
        {/* for addiing dark mode on search section  */}
        <div className='dark:bg-zinc-900 bg-amber-100 w-1/2 dark:text-white text-zinc-800 m-auto rounded-4xl h-16 border border-zinc-600 flex p-1 pr-5'>

          <input type="text" placeholder='Ask me anything!' value={question}
            onKeyDown={isEnter}
            onChange={(event) => setQuestion(event.target.value)} className='w-full h-full p-3 outline-none' />

          <button onClick={askQuestion}>Ask</button>
        </div>
      </div>
    </div>
    </div>

  )
}

export default App
